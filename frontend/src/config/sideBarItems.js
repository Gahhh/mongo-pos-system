import {
  AppstoreOutlined,
  ShopOutlined,
  UserOutlined,
  SettingOutlined,
  CaretLeftOutlined
} from '@ant-design/icons';

export const sideBarData = [
  {
    label: "Back to Roles",
    key: "/roles",
    id: "backroles",
    icon: <CaretLeftOutlined />,
  },
  {
    label: "My Site",
    key: "/dashboard/mysite",
    id: "dashboared",
    icon: <ShopOutlined />,
  },
  {
    label: "Profile",
    key: "/dashboard/profile",
    id: "profile",
    icon: <UserOutlined />,
  }, 
  {
    label: "Site Information",
    key: "/dashboard/siteinfo",
    id: "settings",
    icon: <SettingOutlined />,
  },  
  {
    label: "My Menu",
    key: "/dashboard/createCategory",
    id: "createCategory",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Create Item",
    key: "/dashboard/createMenuItem",
    id: "newItem",
    icon: <SettingOutlined />,
  },
];
