public  class StringArrayTest {

    public static List<String> generateStringArray(Integer numOfReturn){
        List<String> s = new List<String>();
        for(Integer i =0 ; i<numOfReturn ; i++){
            s.add('Test'+ i);

        }
         return s;


    }

}