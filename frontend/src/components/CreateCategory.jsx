import React, { useState, useEffect } from 'react';
import ReactDragListView from "react-drag-listview";
import {
  Collapse,
  Button,
  Input,
  Form,
  Modal,
  List,
  Avatar,
  Dropdown,
  Menu,
  message,
  Space,
  Drawer,
  InputNumber,
  Upload,
  Select,
  Layout,
  Table,
} from 'antd';
import { 
  PlusOutlined, MinusOutlined, DeleteOutlined, EditOutlined, CoffeeOutlined, DragOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { updateCategoryRequest, getCategoryRequest, deleteMenuItemRequest, editMenuItemRequest} from '../utils/apiRequests';
import { dietaryOption} from '../config/dietaryOption';
import { countryList } from '../config/translate';
import ReactCountryFlag from 'react-country-flag';
import { getBase64 } from '../utils/utilsFunctions';
import { uploadFile, getPreSignedUrl } from '../utils/awsService';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Content } = Layout;
const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const preventText = {
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  MsUserSelect: 'none',
  userSelect: 'none',
}

const options = dietaryOption.map((item) => {
  return { label: item, value: item };
});

const translateOptions = countryList.map((country) => {
  return (
    <Option key={country.language_name} value={country.language_code}>
      <ReactCountryFlag countryCode={country.country_code.toUpperCase()} svg />
      <span style={{marginLeft: '10px'}}>{country.language_name}</span>
    </Option>
  );
});

const handleSelection = (value) => {
  const max = 2;
  if (value.length > max) {
    value.length = max;
  }
}

const getCategories = async () => {
  const res = await getCategoryRequest();
  if (!res.ok) {
    return [];
  } else {
    const data = await res.json();
    const categoriesList = [];
    const menu = data?.menu ? data.menu : [];
    if (data.categoryInfo?.category){
      for (const category in data.categoryInfo.category) {
        const originList = data.categoryInfo.category[category];
        const dishList = [];
        for (const dish in originList) {
          const dishId = originList[dish];
          const dishInfo = menu.find((item) => item._id === dishId);
          
          if (dishInfo!==undefined){
            dishList.push(dishInfo);
          }
            
        }
        const categoryObj = {
          name: category,
          list: dishList,
        };
        categoriesList.push(categoryObj);
      }
      // console.log(categoriesList[0]);
      return categoriesList;
    }
    else {
      return [];
    }
  }
};


const CreateCategory = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [addForm] = Form.useForm();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [editMenuForm] = Form.useForm();
  const [menuItemInfo, setMenuItemInfo] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [menuThumbnail, setMenuThumbnail] = useState('');
  const [deleteThumbnailButton, setDeleteThumbnailButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const showDrawer = async (item) => {
    setMenuItemInfo(item);
    setOpenDrawer(true);
  };

  useEffect(() => {
    if (menuItemInfo) {
      editMenuForm.setFieldValue('itemName', menuItemInfo.itemName);
      editMenuForm.setFieldValue('price', menuItemInfo.price);
      editMenuForm.setFieldValue('description', menuItemInfo.description);
      editMenuForm.setFieldValue('dietary', menuItemInfo.dietary);
      editMenuForm.setFieldValue('translationLanguage', menuItemInfo.translationLanguage);
      editMenuForm.setFieldValue('options', menuItemInfo.options);
      if (menuItemInfo.thumbnail) {
        setMenuThumbnail(menuItemInfo.thumbnail);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ menuItemInfo]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setMenuItemInfo(null);
    setMenuThumbnail('');
    setFileList([]);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res);
    }
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   console.log('categories is updated');
  // }, [categories]);

  const handleDelete = async() => {
    const data = {};
    categories.forEach((category) => {
      data[category.name] = category.list.map((item) => item._id);
    });
    const res = await updateCategoryRequest({category: data});
    if (!res.ok) {
      message.error('Failed delete category!');
    } else {
      message.success('Successfully delete category');
    }
  }


  // confirm delete a category
  useEffect(() => {
    if (confirmDelete){
      setConfirmDelete(false);
      handleDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, confirmDelete]);

  // change category name
  const handleEdit = async() => {
    const data = {};
    categories.forEach((category) => {
      data[category.name] = category.list.map((item) => item._id);
    });
  }

  // confirm edit a category
  useEffect(() => {
    if (confirmEdit){
      setConfirmEdit(false);
      handleEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, confirmEdit]);

  // when click save button, update category
  const onFinish = async () => {
    const data = {};
    categories.forEach((category) => {
      data[category.name] = category.list.map((item) => item._id);
    });
    console.log(data);
    const res = await updateCategoryRequest({category: data});
    if (res.ok) {
      Modal.success({
        title: 'Success',
        content: 'Category updated successfully',
      });
    } else {
      Modal.error({
        title: 'Error',
        content: 'Failed to update category',
      });
    }

  };
  
  // decide whether to show add category or edit category
  const editCategoryName = () => {
    setShowEdit(!showEdit);
  };

  // define buttons at left side of the panel bar
  const CategoryButtons = (index) => {
    const deleteCategory = () => {
      const categoryName = categories[index].name;
      if (categoryName === 'default') {
        // check if the category is empty
        if (categories[index].list.length !== 0) {
          message.error('You can only delete empty default category');
          return;
        }
      }
      Modal.confirm({
        title: 'Are you sure to delete this category?',
        content: 'This action cannot be undone',
        onOk: async() => {
          // check the category name
          const thisCategory = categories[index];
          const thisCategoryList = thisCategory.list;
          let newCategories = categories;
          if (thisCategoryList.length === 0) {
              newCategories = newCategories.filter((_, i) => i !== index);
          }
          else {
            let defaultExist = false;
            for (const i in newCategories) {
              if (newCategories[i].name==='default'){
                defaultExist = true;
              }
            }
            
            newCategories = newCategories.filter((_, i) => i !== index);
            if (!defaultExist){
              const defaultCategory = [{name: 'default', list: []}]
              newCategories=defaultCategory.concat(newCategories);
            }
            newCategories[0].list = newCategories[0].list.concat(thisCategoryList);
          }
          setCategories(newCategories);
          setConfirmDelete(true);
        },
      });
    };

    // save the category name, and hide the done editting button
    const saveChangeCategoryName = (e) => {
      const word = e.target.value;
      if (word !== '') {
        const newCategories = categories.map((category, i) => {
          if (i === index) {
            return {name:word, list: category.list};
          } else {
            return category;
          }
        });
        setCategories(newCategories);
        setConfirmEdit(true);
      }
    };

    return(
      <React.Fragment>
      {!showEdit && 
        <Input 
          onBlur={saveChangeCategoryName}
        />
      }
      <DragOutlined style={{marginRight:10, paddingInline:20}} className='DragOutlined'/>
      <DeleteOutlined onClick={deleteCategory}/>
      </React.Fragment>
    );
  }

  // when add a new category, add the category name to the category list, and update the category
  const confirmAdd = async () => {
    setShowAdd(false);
    const value = addForm.getFieldValue('newCategoryName');
    for (const category of categories) {
      if (category.name === value) {
        message.error('Category name already exists');
        return;
      }
    }
    const newCategories = categories;
    const newCategory = {
      name: value,
      list: [],
    };
    newCategories.push(newCategory);
    const addFinish = async () => {
      setCategories(newCategories);
    };
    await addFinish();
    const data = {};
    categories.forEach((category) => {
      data[category.name] = category.list.map((item) => item._id);
    });
    const res = await updateCategoryRequest({category: data});
    if (res.ok) {
      message.success('Category added successfully');
    } else {
      message.error('Failed to add category');
    }
  }

  const cancelAddCategory = () => {
    setShowAdd(false);
  }

  // only show when push add button
  const newCategoryNameInput = () => {
    return(
      <Form
        form={addForm}
        name="addCategory"
        onFinish={confirmAdd}
        autoComplete="off"
      >
        <Form.Item
          name="newCategoryName"
          rules={[
            {
              required: true,
              message: 'Please input your new category name!',
            },
          ]}
        >
          <Input 
            placeholder="New Category Name"
          />
          
        </Form.Item>
        <Button type="primary" htmlType="submit">
            Add
        </Button>
        <Button type="button" style={{marginLeft:10}} onClick={cancelAddCategory}>
            Cancel
        </Button>
      </Form>
    );
  }

  // when click add button, show the input box
  const addCatOnClick = () => {
    setShowAdd(true);
  }

// generate all category panel
  const categoryPanels = (props) => {
    const setCategories = props;
    // all dishes in one category, show them in a list
    const dishList = (list, oldCat)=> {
      // when click move button, move the dish to another category
      const menuOnClick = (e) => {
        const myArray = e.key.split("<.<-ne<pr+at&e->@>");
        const newCat = myArray[0];
        const id = myArray[1];
        const oldCat = myArray[2];
        if (newCat !== oldCat) {
          let dish = {};
          const newCategories = categories.map((category, i) => {
            if (category.name === oldCat) {
              dish = category.list.find((item) => item._id === id);
              const newList = category.list.filter((item) => item._id !== id);
              
              return {name:category.name, list: newList};
            } else {
              return category;
            }
          });
          const newCategories2 = newCategories.map((category, i) => {
            if (category.name === newCat) {
              const newList = category.list;
              newList.push(dish);

              return {name:category.name, list: newList};
            } else {
              return category;
            }
          });
          setCategories(newCategories2);
        }
        
      }

      const onDragEnd = (fromIndex, toIndex) => {
        console.log('dragging dishes');
        const newCategories = categories.map((category, i) => {
          if (category.name === oldCat) {
            const newList = category.list;
            const dish = newList[fromIndex];
            newList.splice(fromIndex, 1);
            newList.splice(toIndex, 0, dish);
            return {name:category.name, list: newList};
          } else {
            return category;
          }
        });
        setCategories(newCategories);
      }

      return(
        <React.Fragment>
          {/* add React DragList, so you can drag a item and change it's place inside a category */}
          <ReactDragListView
            nodeSelector=".ant-list-item"
            handleSelector=".dragDishButton"

            onDragEnd={onDragEnd}>
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item className="draggble" style={{...preventText}}>
                <List.Item.Meta
                  onClick={()=>{showDrawer(item)}}
                  style={{cursor:'pointer'}}  
                  avatar={item.thumbnail? 
                    <Avatar src={item.thumbnail} />:
                    <div 
                      style={{width:33, height:47.97,
                        display:'flex', justifyContent:'center',
                        alignItems:'center',}}
                    > 
                      <CoffeeOutlined/>
                    </div>}
                  title={item.itemName}
                  description={item.description}
                />
                <Dropdown 
                 trigger={['click']}
                overlay={
                    <Menu
                    onClick={menuOnClick}
                    items={categories.map((category) => {
                      const option = {
                        key: category.name +"<.<-ne<pr+at&e->@>" +item._id+ "<.<-ne<pr+at&e->@>" + oldCat,
                        label: category.name,
                      }
                      return option;
                    })
                    }/>}>
                  <a className="dragDishButton" 
                  onClick={(e) => e.preventDefault()}
                  >
                    <DragOutlined style={{paddingInline:20 }}/>
                  </a>
                </Dropdown>
              </List.Item>
            )}
          />

        </ReactDragListView>
        </React.Fragment>
      );
    }
  
    if (categories.length === 0){
      setCategories([{name: 'default', list: []}]);
    }

    const onDragCategory = (fromIndex, toIndex) => {
      console.log('dragging category');
      const newCategories = [ ...categories];
      const category = newCategories[fromIndex];
      newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, category);
      setCategories(newCategories);
    }
    return(
      <React.Fragment>
        <ReactDragListView
            nodeSelector=".ant-table-row"
            handleSelector=".DragOutlined"
            onDragEnd={onDragCategory}>
          <Table
            showHeader={false}
            style={{...preventText, marginTop:30, marginBottom:30}}
            dataSource={categories
              .map((category, i) => {
                return {key: i, name: category.name, list: category.list};
              })
              }                      
            pagination={false}
            rowKey={(record) => record.name}
            className="draggble"
          >
            <Table.Column
              title="Dishes"
              dataIndex="list"
              key="list"
              style={{ padding: 0 }}
              onCell={() => {
                return {
                  style: {
                    padding: 0,
                  },
                };
              }}
              render={(list, record, key) => (
                  <Collapse  key={record.name} style={{width:'100%'}}>
                    <Panel header={record.name}  extra={CategoryButtons(key)}>
                      {dishList(list, record.name)}
                    </Panel>
                  </Collapse>
                
              )}
              
            />
            </Table>


        </ReactDragListView>

      </React.Fragment>
    );   
  }
  //////////////////////////////////////////////////////////////////////
  const onCancel = async() => {
    const res = await getCategories();
    setCategories(res);
  }

  // when click save button in drawer
  // send data to api, and update categories by useState
  const onChangeFinish = async(values) => {
    values.itemId = menuItemInfo._id;
    const photo = fileList[0];
    if (photo) {
      const photoUrl = await getBase64(photo.originFileObj);
      const photoPack = {
        name: photo.name,
        image: photoUrl,
        type: photo.type
      }
      const awsRes = await uploadFile(photoPack);
      const url = await getPreSignedUrl(awsRes);
      values.thumbnail = url;
    }
    const res = await editMenuItemRequest(values);
    if (!res.ok) {
      message.error('Failed to edit menu item');
      return;
    }
    const newCategories = categories.map((category, i) => {
      const newList = category.list.map((item) => {
        if (item._id === values.itemId) {
          if (!menuThumbnail){
            setMenuThumbnail(item.thumbnail);
          }
          return {...item, ...values};
        } else {
          return item;
        }
      });
      return {name:category.name, list: newList};
    });
    setCategories(newCategories);
    setFileList([]);
    
    Modal.success({
      content: 'Menu item edited successfully',
    });
  }

  // should change log to real delete function
  // send delete request to api, and update categories by useState
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleDeleteMenuOk = async () => {
    setIsModalOpen(false);
    const menuId = menuItemInfo._id;
    const data = {};
    categories.forEach((category) => {
      data[category.name] = category.list.map((item) => item._id).filter((id) => id !== menuId);
    });
    const res = await deleteMenuItemRequest({id: menuId, category:data});
    if (!res.ok){
      Modal.error({
        content: 'Failed to delete menu item',
      });
    }else {
      const newCategories = categories.map((category) => {
        const newList = category.list.filter((item) => item._id !== menuId);
        return {name: category.name, list: newList};
      });
      setCategories(newCategories);
      closeDrawer();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteDish = async() => {
    showModal();
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
  }

  const handleChange = async({ fileList: newFileList }) => {
    const res = await getBase64(newFileList[0].originFileObj);
    setFileList(newFileList)
    setMenuThumbnail(res);
  };


  const handleUpload = async (option) => {
    option.onSuccess();
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      Modal.error({
        title: 'You can only upload JPG/PNG file!',
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Modal.error({
        title: 'Image must smaller than 2MB!',
      });
    }
    return isJpgOrPng && isLt2M;
  }

  const clearUploadThumbnail = () => {
    setFileList([]);
    setMenuThumbnail('');
  }

  return (
    <Layout style={{
      minHeight: '100vh',
    }}>
      <Content
        style={{
          maxWidth: '700px',
          marginLeft: 30,
          marginRight: 30,
          marginBottom: 30,
          marginTop:40,
        }}
      >
      {!showAdd && showEdit &&
      <React.Fragment>
        <Button type="default" onClick={addCatOnClick}>
          <PlusOutlined /> Category
        </Button>
        <Button type="default" onClick={editCategoryName} style={{marginLeft:10}}>
          <EditOutlined />Edit Name
        </Button>
      </React.Fragment>
      }

      {!showEdit &&
        <Button type="primary" onClick={editCategoryName}>
          <MinusOutlined />Done
        </Button>
      }
      {showAdd && newCategoryNameInput()}
     
      
      {categoryPanels(setCategories)}
      
      <Button  type="primary" onClick={onFinish}>
      Save
      </Button>
      <Button type="button" onClick={onCancel} style={{marginLeft:10}}>
      Cancel
      </Button>

      <Drawer
        title="Edit Menu"
        placement="right"
        open={openDrawer}
        onClose={closeDrawer}
        extra={
          <Button type="primary" danger onClick={deleteDish}>
            Delete
          </Button>
        }
      >
        <Form
        form={editMenuForm}
        onFinish={onChangeFinish}
        scrollToFirstError
        layout="vertical"
        >
          <Form.Item
          label="Item Name:"
          name="itemName"
          >
            <Input placeholder="Item Name" />
          </Form.Item>

          <Form.Item
          label="Price:"
          name="price"
          >
            <InputNumber 
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
          label="Dietary attributes:"
          name="dietary"
          >
            <Select
            mode="tags"
            style={{
              width: '100%',
            }}
            tokenSeparators={[',']}
            options={options}
            />
          </Form.Item>

          {menuThumbnail||fileList.length >= 1? 
          <Form.Item label="Photo: ">
            <div style={{border:'1px solid lightgray', 
                width:'320px'}}>
                  
              <img src={menuThumbnail} alt="menuThumbnail" 
                style={{margin:'2%', width:'96%',postion:'absolute'}}
                onClick={()=>{setDeleteThumbnailButton(true)}}
                onMouseOver={()=>{setDeleteThumbnailButton(true)}}
                />
              {deleteThumbnailButton &&
              <div className='deleteThumbnailButton'
                onClick={()=>{setDeleteThumbnailButton(false)}}
                onMouseLeave={()=>{setDeleteThumbnailButton(false)}}
                style={{width:'100%',height:'100%', 
                  backgroundColor:'rgba(30, 30, 30, .5)',
                  position:'absolute', left:0, top:0,
                  display:'flex', justifyContent:'center', alignItems:'center'}}>
                <DeleteOutlined style={{fontSize:'50px', color:'white'}} onClick={clearUploadThumbnail}/>
              </div>
              }
            </div>
          </Form.Item>
          :
          <Form.Item
            label="Photo: "
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
          <Upload
            listType="picture-card"
            onChange={handleChange}
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
          >
            {uploadButton}
          </Upload>
          </Form.Item>
          }
          
          <Form.Item
          label="Description:"
          name="description"
          >
            <TextArea
              placeholder="Description"
              autoSize={{
                minRows: 2,
                maxRows: 5,
              }}
            />
          </Form.Item>

          <Form.Item
            name="translationLanguage"
            label="Translation Language: "
            extra="Please select the languages for translation of your item description (Max 2)"
          >
            <Select
              mode="multiple"
              style={{
                width: '100%',
              }}
              placeholder="select one or two languages"
              onChange={handleSelection}
              optionLabelProp="key"
            >
              {translateOptions}
            </Select>
          </Form.Item>

          <Form.Item
            label="Option Set: "
            extra="Please add additional options for your item if applicable"
          >
            <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'optionName']}
                      rules={[{ required: true, message: 'Missing option name' }]}
                    >
                      <Input placeholder="Option name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'optionPrice']}
                      rules={[{ required: true, message: 'Missing option price' }]}
                    >
                      <InputNumber
                          placeholder='Option price'
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Change
            </Button>
          </Form.Item>
        </Form>
        <Modal title="Warning!" open={isModalOpen} onOk={handleDeleteMenuOk} onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
          }
        }}>
        <p>Are you sure delete <span style={{fontWeight:'bold'}}>{menuItemInfo? menuItemInfo.itemName: 'this item'}</span>?</p>
        </Modal>
      </Drawer>
      </Content>
    </Layout>
  )
}

export default CreateCategory;