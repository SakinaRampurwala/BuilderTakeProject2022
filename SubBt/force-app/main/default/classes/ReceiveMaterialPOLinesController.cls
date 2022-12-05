public with sharing class ReceiveMaterialPOLinesController {
    
    @auraEnabled
    public static list<buildertek__Purchase_Order_Item__c> getProducts(String recordId)
    {
        //system.debug(recordId);
        list<buildertek__Purchase_Order_Item__c> Products =[select id,Name,buildertek__Purchase_Order__c, buildertek__Product__r.Name,buildertek__Product__r.Id,buildertek__Product__c,buildertek__Quantity__c from buildertek__Purchase_Order_Item__c WHERE buildertek__Purchase_Order__c =:recordId];
        system.debug(Products);
        return Products;
    }
    
    
    @auraEnabled
    public static boolean addProducts(String ProductsList){
        
        //   list<Product2> prod = [select Id from Product2 where Id IN:= POItems ];
        system.debug('workinggggg');
        system.debug('productsKist'+ ProductsList);
        List<String> selectedProdIds = new List<String>();
        list<RfqDataTableWrapper> newProductList = (list<RfqDataTableWrapper>)JSON.deserialize(ProductsList, list<RfqDataTableWrapper>.class);
        
        if (newProductList != null)
        {
            System.debug(newProductList);
            for(RfqDataTableWrapper p: newProductList){
                selectedProdIds.add(p.prodId);
                
            }
            List<Product2> newProdListToUpdate = new List<Product2>();
            Map<String,Decimal> prodMap = new Map<String,Decimal>();
            Decimal quant = 0;
            for(RfqDataTableWrapper newProd : newProductList){
                //prodMap.put(newProd.prodId, newProd.quantity_recieved);
                if(prodMap.containsKey(newProd.prodId)){
                    quant = prodMap.get(newProd.prodId);
                    if(quant != null){
                        quant = quant+newProd.quantity_recieved;
                    }else{
                        quant = newProd.quantity_recieved;
                    }
                     prodMap.put(newProd.prodId, quant);
                }else{
                    prodMap.put(newProd.prodId, newProd.quantity_recieved);
                }
                //newProdListToUpdate.add(prodItem);
            }
            List<Product2> prodListToUpdate = [Select Id,buildertek__Available_Quantity__c FROM Product2 WHERE Id IN:prodMap.keySet()];
            for(Product2 prod:prodListToUpdate){
                Product2 prodItem = new Product2();
                prodItem.Id = prod.Id;
                prodItem.buildertek__Available_Quantity__c = prodMap.get(prod.Id);
                system.debug(prodMap.get(prod.Id));
                newProdListToUpdate.add(prodItem);
            }
            update newProdListToUpdate;
            
            system.debug(newProdListToUpdate);
            return true;
        }
        
        return false;
        // List<String> SelectedProductIds = purchaseItemids;
        
        /* String PurchaseId = purchaseId;

List<Product2> Products = [SELECT Id, Name,  buildertek__Trade_Type__c  FROM Product2 Where id IN :SelectedProductIds];
List<buildertek__Purchase_Order_Item__c> PoItemList = new List<buildertek__Purchase_Order_Item__c>();
for(Product2  Product : Products){
buildertek__Purchase_Order_Item__c POItem = new buildertek__Purchase_Order_Item__c();
POItem.Name = Product.Name;
POItem.buildertek__Purchase_Order__c = RfqRecId;
POItem.buildertek__Product__c = Product.Id;
POItem.buildertek__Quantity__c = 1;
PoItemList.add(POItem);
}*/
        // insert PoItemList;
        // system.debug(PoItemList);
        // return null;
    }
    
    
    
 public class RfqDataTableWrapper{
      
        @AuraEnabled
        public Integer quantity_recieved{ get; set; }
        
        @AuraEnabled
        public Id prodId{ get; set; }
    }
}