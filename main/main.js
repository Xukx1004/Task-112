const Item = require('./datbase.js');
module.exports = printInventory;
function  printInventory(inputs){
    let allItems = Item.loadAllItems();
    let promotions = Item.loadPromotions()[0].barcodes ;
    let obj_inputs = Obj_inputs(inputs);//输入整合
    let obj_promotion = obj_promotions(obj_inputs,promotions) ;//优惠整合
    let arr = str_shop(obj_inputs,allItems,obj_promotion);//数组输出

    let str = '***<没钱赚商店>购物清单***\n' +arr[0]+
    '----------------------\n' +
    '挥泪赠送商品：\n' +arr[1]+
    '----------------------\n' +
    `总计：${arr[2]}(元)\n` +
    `节省：${arr[3]}(元)\n` +
    '**********************';
    console.log(str) ;
    return 'Hello world';
}

//printInventory(inputs);
 
//输入整合
function Obj_inputs(inputs){
    let obj_inputs = {};
    for(let item of inputs){
        if(item.length !== 10){  //特例输入
            let arr = item.split('-');
            if(!obj_inputs[arr[0]]){
                obj_inputs[arr[0]] = arr[1] ;
            }else{
                obj_inputs[arr[0]] += arr[1] ;
            }
        }else{//一般输入
            if(!obj_inputs[item]){
                obj_inputs[item] = 1 ;
            }else{
                obj_inputs[item] ++ ;
            }   
        }
    }
    return obj_inputs ;
}

//优惠部分
function obj_promotions(obj_in,promotions){
    let obj = {} ;//优惠对象和数量
    for(let key in obj_in){
        if(promotions.indexOf(key) !== -1){
            obj[key] = parseInt(obj_in[key]/3) ;
        }
    }
    return obj ;
}

//小票购物部分
function str_shop(obj_in,allItems,obj_promotion){
    let str_pay = '' ;//支付显示
    let str_pro = '' ;//优惠显示
    let str_arr = [] ;
    let pay = 0;      //实付金额
    let pro_pay = 0 ; //优惠金额
    for(let key in obj_in){
        for(let item of allItems){
            if(item.barcode === key){
                if(obj_promotion[key]){//优惠商品
                    str_pro += `名称：${item.name}，数量：${obj_promotion[key]}${item.unit}\n` ;
                    let one_price= item.price * (obj_in[key] - obj_promotion[key]) ;//这里有一步隐式转换
                    pay += one_price ;
                    pro_pay += item.price * obj_promotion[key] ;
                    str_pay +=  `名称：${item.name}，数量：${obj_in[key]}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${one_price.toFixed(2)}(元)\n`
                }else{//非优惠商品
                    let one_price= item.price * (obj_in[key]) ;//这里有一步隐式转换 
                    pay += one_price ;
                    str_pay +=  `名称：${item.name}，数量：${obj_in[key]}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${one_price.toFixed(2)}(元)\n`
                }
            }
        }
    }
    str_arr.push(str_pay);
    str_arr.push(str_pro);
    str_arr.push(pay.toFixed(2)) ;
    str_arr.push(pro_pay.toFixed(2));
    return str_arr ;
}