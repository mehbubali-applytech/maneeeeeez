export interface IModule {
  id: number;
  moduleName: string;
  moduleCode: string;
  category: string;
  status: string;
  tier: string;
  price: number;
  users: number;
  createdAt: string;
  lastUpdated: string;
  description: string;
  [key: string]: any;
}

export interface IModuleForm {
  moduleName: string;
  moduleCode: string;
  category: string;
  tier: string;
  price: number;
  maxUsers: number;
  description: string;
  [key: string]: any;
}

export interface moduleStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: IModule | null;
}

export interface moduleDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: IModule | null;
}