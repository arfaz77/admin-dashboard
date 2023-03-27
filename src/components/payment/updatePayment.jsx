import React from 'react'
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import{useUserQuery,useUpdatePaymentMutation,usePaymentDetailsQuery} from '../../utils/graphql'

const UpdatePayment = () => {
  const {id}=useParams()
  const { data, loading, error } = useUserQuery({variables: { where: { id: id } }});
  const payment = usePaymentDetailsQuery({variables: { where: { id: id } }});
  console.log(payment?.data,"payment")
  const [addAmount]=useUpdatePaymentMutation({variables: { where: { id: id } }})
 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async(dataOnSubmit) =>{ console.log(dataOnSubmit,"data")
  const price=+dataOnSubmit.amount
  const amount={
   
      amount:price,
 paymentFor:dataOnSubmit?.paymentFor,
 status:dataOnSubmit?.paymentStatus,
 description:dataOnSubmit?.description
    

  }
  
  if(dataOnSubmit.imgForPaymentProof && dataOnSubmit.imgForPaymentProof.length){
   amount["image"] = { upload: dataOnSubmit.imgForPaymentProof[0] }
  }
  addAmount({variables: {data:amount,id:id}})
  
  };

  
  return (
    <div className="flex flex-col space-y-10 justify-center align-middle w-full bg-gray-50  my-10">
      <form onSubmit={handleSubmit(onSubmit)} className=" w-full my-5 space-y-10">
         <div className="flex space-x-2 justify-around">
          
            <div className="w-1/3">
              <label htmlFor="">First Name</label>
              <input  value={payment?.data?.payment?.user?.firstName} disabled  type="text" className="input input-bordered input-secondary w-full " {...register("IdNumber", {minLength:8 })}></input>
              <p className="text-red-500"> {errors.IdNumber && <span>Atleast 8 charators required</span>}</p>
            </div>

            <div className="w-1/3">
              <label htmlFor="">User Name</label>
              <input value={payment?.data?.payment?.user?.username} disabled  type="text" className="input input-bordered input-secondary w-full " {...register("IdNumber", {minLength:8 })}></input>
              <p className="text-red-500"> {errors.IdNumber && <span>Atleast 8 charators required</span>}</p>
            </div>
            
          </div>

          <div className="flex space-x-2 justify-around">
          
          <div className="w-1/3">
            <label htmlFor="">Amount</label>
            <input defaultValue={payment?.data?.payment?.amount}  type="number" className="input input-bordered input-secondary w-full " {...register("amount", {})}></input>
            <p className="text-red-500"> {errors.amount && <span>Amount Required</span>}</p>
          </div>
          <div className="min-w-[300px] w-1/3">
            <label htmlFor="">Payment For</label>
            <select defaultValue={payment?.data?.payment?.paymentFor}  className="input input-bordered input-secondary w-full " {...register("paymentFor", {})}>
            <option value=""></option>
      <option value="registrations">Registration</option>
      <option value="emd">EMD</option>
      <option value="refund">Refund</option>
      <option value="other">Other</option>

      
    
    </select>
    <p className="text-red-500"> {errors.paymentFor && <span>This field cannot empty</span>}</p>

          </div>
        </div>

          <div className="flex space-x-2 justify-around">
          
          <div className="w-1/3">
            <label htmlFor="">Description</label>
            <input defaultValue={payment?.data?.payment?.description}  type="text" className="input input-bordered input-secondary w-full " {...register("description", { })}></input>
            {/* <p className="text-red-500"> {errors.description && <span>Atleast 8 charators required</span>}</p> */}
          </div>
          <div className="min-w-[300px] w-1/3">
            <label htmlFor="">Payment Status</label>
            <select defaultValue={payment?.data?.payment?.status}   className="input input-bordered input-secondary w-full " {...register("paymentStatus", {})}>
            <option value=""></option>
      <option value="pending">Pending</option>
      <option value="success">Success</option>
      <option value="failed">Failed</option>
      
    
    </select>
    <p className="text-red-500"> {errors.paymentStatus && <span>Please select Id proof type</span>}</p>

          </div>


          
        </div>
        <div className="flex flex-col space-x-2 justify-center w-1/3 ml-28">

              <label  htmlFor="">Payment proof Image</label>
         
        <div className=" ">
             

              <img
                className="w-full h-36 border py-1"
                // src={`https://api.autobse.com${data?.user?.idProofBack?.url}`}
                alt="no id proof back side_image"
              />
               <input type="file" className="p-1" {...register("imgForPaymentProof", { })}></input>
            </div>
</div>
<div className=" flex justify-center my-5">
          <button
            type="submit" 
            className="btn btn-outline btn-primary px-10"
          >Save </button>
        </div>
        </form>
    </div>
  )
}

export default UpdatePayment