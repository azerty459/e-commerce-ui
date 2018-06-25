export interface NavItem {
  nomCategorie: string;
  id:number;
  route?: string;
  children?: NavItem[];
}
