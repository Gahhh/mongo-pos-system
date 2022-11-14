import backendUrl from '../config/apiAddress';

const fatchData = async (url, method, body=undefined) => {
  const requestOption = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  }
  try {
    const response = await fetch(`${backendUrl}${url}`, requestOption);
    return response;
  } catch (error) {
    return error;
  }
}

export const userRegisterRequest = async (body) => {
  const response = await fatchData('/user/register', 'POST', body);
  return response;
}

export const userLoginRequest = async (body) => {
  const response = await fatchData('/user/login', 'POST', body);
  return response;
}

export const getAdminAccessRequest = async (body) => {
  const response = await fatchData('/user/adminpin', 'POST', body);
  return response;
}

export const verifyPasswordRequest = async (body) => {
  const response = await fatchData('/user/verifypassword', 'POST', body);
  return response;
}

export const getProfileRequest = async () => {
  const response = await fatchData('/user/profile', 'GET');
  return response;
}

export const updateProfileRequest = async (body) => {
  const response = await fatchData('/user/profile/update', 'PATCH', body);
  return response;
}

export const uploadMenuPictureRequest = async (body) => {
  const response = await fatchData('/menu/picture/upload', 'POST', body);
  return response;
}

export const getMenuRequest = async (id) => {
  const response = await fatchData(`/menu/getmenu?id=${id}`, 'GET');
  return response;
}

export const addMenuItemRequest = async (body) => {
  const response = await fatchData('/menu/create', 'POST', body);
  return response;
}

export const deleteMenuItemRequest = async (body) => {
  const response = await fatchData('/menu/deleteitem', 'DELETE', body);
  return response;
}

export const editMenuItemRequest = async (body) => {
  const response = await fatchData('/menu/edit', 'PATCH', body);
  return response;
}

export const updateCategoryRequest = async (body) => {
  const response = await fatchData('/menu/category/add', 'PATCH', body);
  return response;
}

export const getCategoryRequest = async () => {
  const response = await fatchData('/menu/category/get', 'GET');
  return response;
}

export const addNewOrderRequest = async (body) => {
  const response = await fatchData('/order/create', 'POST', body);
  return response;
}

export const editOrderRequest = async (body) => {
  const response = await fatchData('/order/update', 'PATCH', body);
  return response;
}

export const getPOSMenuRequest = async () => {
  const response = await fatchData('/menu/pos', 'GET');
  return response;
}

export const getCurrentOrdersRequest = async (siteId) => {
  const response = await fatchData(`/order/get/current?siteId=${siteId}`, 'GET');
  return response;
}

export const getUnpaidOrdersRequest = async (siteId) => {
  const response = await fatchData(`/order/get/unpaid?siteId=${siteId}`, 'GET');
  return response;
}

export const getCompletedOrdersRequest = async (siteId, page, dateStart, dateEnd) => {
  const response = await fatchData(`/order/get/completed?siteId=${siteId}&page=${page}&dateStart=${dateStart}&dateEnd=${dateEnd}`, 'GET');
  return response;
}

export const completeOneOrdersRequest = async (body) => {
  const response = await fatchData(`/order/status/finishone`, 'POST', body);
  return response;
}

export const paidOneOrdersRequest = async (body) => {
  const response = await fatchData(`/order/status/paid`, 'POST', body);
  return response;
}

export const getSalesRequest = async () => {
  const response = await fatchData('/admin/sales', 'GET');
  return response;
}

export const getSiteIdRequest = async () => {
  const response = await fatchData('/user/siteid', 'GET');
  return response;
}