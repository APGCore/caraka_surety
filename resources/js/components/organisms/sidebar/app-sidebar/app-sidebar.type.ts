export interface IAppSideBarMenu {
  title: string;
  route_name?: string;
  href?: string;
  icon: any;
  items?: {
    title: string;
    route_name: string;
    href: string;
  }[];
}

export interface IAppSideBarProps {
  user?: any;
  routes: IAppSideBarMenu[];
}
