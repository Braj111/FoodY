import { Orders } from "./orderType";

export type MenuItem ={
    _id:string,
    name:string,
    price:number,
    description:string,
    image:string,
}

export type Restaurant={
    _id:string;
    user:string;
    restaurantName:string;
    city:string;
    country:string;
    deliveryTime:number;
    cuisines:string[];
    menus:MenuItem[];
    imageUrl:string;
}

export type RestaurantState={
    loading:boolean;
    restaurant:Restaurant | null;
    searchedRestaurant:SearchedRestaurant |null;
    appliedFilter:string[];
    singleRestaurant:Restaurant | null;
    restaurantOrder:Orders[];
    createRestaurant:(formdata:FormData)=>Promise<void>;
    getRestaurant:()=> Promise<void>;
    updateRestaurant:(formdata:FormData)=> Promise<void>;
    searchRestaurant:(searchText:string, searchQuery:string, selectedCuisines:any)=> Promise<void>;
    addMenuToRestaurant:(menu:any)=> void;
    updateMenuToRestaurant:(menu:any)=> void;
    setAppliedFilter:(value:string) => void;
    resetAppliedFilter:()=> void;
    getSingleRestaurant:(restaurantId:string)=> Promise<void>;
    getRestaurantOrders:()=> Promise<void>;
    updateRestaurantOrder:(orderId:string, status:string)=> Promise<void>;
  }

export type SearchedRestaurant ={
    data:Restaurant[]
  }