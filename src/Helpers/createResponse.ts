export const createResponse=(res:any,code:any=200,message:any='',data:any=[],success:any=true,error:any=false )=>{
    res.json({
            code,
            message ,
            success ,
            error ,
            data ,
            
        })
}