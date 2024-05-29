import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateBidMutation,
  useEditEventMutation,
  useUpdateVehicleMutation,
  useUserbyIdNoQuery,
} from "../../utils/graphql";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";


const VehicleDetails = (props) => {
  // -------------------------------------------
  const initialState = {
    vehicleDetails: props,
    bidAmount: props?.liveVehicle?.startBidAmount,
    vehicleId: props?.liveVehicle?.id || null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_VEHICLE_DETAILS":
        return { ...state, vehicleDetails: action.payload };
      case "SET_BID_AMOUNT":
        return { ...state, bidAmount: action.payload };
      case "UPDATE_BID_AMOUNT":
        return { ...state, bidAmount: state.bidAmount + action.payload };
      case "SET_VEHICLE_ID":
        return { ...state, vehicleId: action.payload };
      default:
        return state;
    }
  };


  const [state, dispatch] = useReducer(reducer, initialState);
  const { vehicleDetails, bidAmount } = state;

  useEffect(() => {
    dispatch({ type: "SET_VEHICLE_DETAILS", payload: props });

    if (state.vehicleId !== props?.liveVehicle?.id) {
      dispatch({ type: "SET_VEHICLE_ID", payload: props?.liveVehicle?.id });
      dispatch({
        type: "SET_BID_AMOUNT",
        payload: props?.liveVehicle?.startBidAmount,
      });
    }
    if (bidAmount < props?.liveVehicle?.currentBidAmount) {
      dispatch({
        type: "SET_BID_AMOUNT",
        payload: props?.liveVehicle?.currentBidAmount,
      });
      setValue("amount", bidAmount);
    }
  }, [props, bidAmount, state.vehicleId]);

  useEffect(() => {
    setValue("amount", bidAmount);
  }, [bidAmount]);
  // ...........................................................

  const [userIdNo, setUserId] = useState();
  const [startPrice, setStartPrice] = useState(
    props?.liveVehicle?.startBidAmount
  );

  const { data, refetch } = useUserbyIdNoQuery({
    variables: { where: { tempToken: +userIdNo } },
  });
  const [pauseEvent] = useEditEventMutation({
    variables: { where: { id: vehicleDetails?.liveVehicle?.event?.id } },
  });
  const [editVehicle] = useUpdateVehicleMutation({
    variables: { where: { id: vehicleDetails?.liveVehicle?.id } },
  });


  const incrementAmounts = [
    {
      id: 1,
      label: "1,000",
      value: 1000,
    },
    {
      id: 2,
      label: "2,000",
      value: 2000,
    },
    {
      id: 3,
      label: "5,000",
      value: 5000,
    },
    {
      id: 4,
      label: "10,000",
      value: 10000,
    },
    {
      id: 5,
      label: "25,000",
      value: 25000,
    },
  ];

  const [bidVehicle] = useCreateBidMutation();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (onSubmitData) => {
   


 

    const { token, amount } = onSubmitData;

    setUserId(token);

    if (data?.user?.id) {
      // const result=({
      //     variables: {
      //       data: {
      //         bidVehicle: { connect: { id: vehicleDetails?.liveVehicle?.id } },
      //         user: { connect: { id: data?.user?.id } },

      //         amount: +amount,
      //       },
      //     },
      //   })
      const result = bidVehicle({
        variables: {
          data: {
            bidVehicle: { connect: { id: vehicleDetails?.liveVehicle?.id } },
            user: { connect: { id: data?.user?.id } },
  
            amount: +amount,
          },
        },
      })
        .then((result) => {
          // Additional actions after successful bid submission

          Swal.fire({
            title: `Amount ${result?.data?.createBid?.amount} successfully Added`,
            icon: "success",
          });
          setUserId(0);
        })
        .catch((error) => {
          console.error(error, "error");

          Swal.fire({
            title: ` ${error}`,
            icon: "error",
          });
          // Handle any errors that occur during bid submission
          setUserId(0);
        });
      if (!result) {
        alert("Please check token number");
      }
    }
  };

  const handleEvent = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      pauseEvent({ variables: { data: { status: "pause" } } }).then(
        (result) => {
          Swal.fire({
            title: `Event Paused Successfully`,
            icon: "success",
          });
        }
      );
    }
  };
  const handleStartPrice = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      editVehicle({ variables: { data: { startBidAmount: +startPrice } } })
        .then((result) => {
          Swal.fire({
            title: `Start Price Updated Successfully`,
            icon: "success",
          });
        })
        .catch((error) => {
          Swal.fire({
            title: error,
            icon: "success",
          });
        });
    }
  };
  const handleBidAmount = (price) => {
    dispatch({ type: "UPDATE_BID_AMOUNT", payload: price });
  };
  const handlePending = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      editVehicle({ variables: { data: { bidStatus: "pending" } } })
        .then((result) => {
          Swal.fire({
            title: ` Current Status Pending`,
            icon: "success",
          });
        })
        .catch((error) => {
          Swal.fire({
            title: error,
            icon: "success",
          });
        });
    }
  };

  const handleApproved = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      editVehicle({ variables: { data: { bidStatus: "approved" } } })
        .then((result) => {
          Swal.fire({
            title: `Vehicle current Status Approved`,
            icon: "success",
          });
        })
        .catch((error) => {
          Swal.fire({
            title: error,
            icon: "success",
          });
        });
    }
  };
  const handleFullfilled = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      editVehicle({ variables: { data: { bidStatus: "fulfilled" } } })
        .then((result) => {
          Swal.fire({
            title: `Vehicle current Status Fullfilled`,
            icon: "success",
          });
        })
        .catch((error) => {
          Swal.fire({
            title: error,
            icon: "success",
          });
        });
    }
  };
  const handleDeclined = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      editVehicle({ variables: { data: { bidStatus: "declined" } } })
        .then((result) => {
          Swal.fire({
            title: `Vehicle current Status Declined`,
            icon: "success",
          });
        })
        .catch((error) => {
          Swal.fire({
            title: error,
            icon: "success",
          });
        });
    }
  };

  return (
    <div className="flex  justify-around  border-2 shadow-md p-2 bg-[#f1e9e3]">
      <div className="border-2 shadow-md border-white  rounded-lg flex justify-center align-middle p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-5 p-2   border-2 rounded-lg shadow-lg border-black  px-4 bg-white font-medium">
            <div className="space-x-5 flex text-center flex-col ">
              <label className="pl-5 font-bold uppercase">
                Lot Number :{" "}
                <span className="text-red-500">
                  {" "}
                  {vehicleDetails?.liveVehicle?.lotNumber}
                </span>
              </label>
            </div>

            <div className=" flex flex-col  ">
              <label className="">Amount</label>
              <div>
                <input
                  type="number"
                  className="bg-gray-50 border-2 border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-72"
                  {...register("amount", { required: true })}
                />

                {errors.amount && <p>Amount is required</p>}
              </div>
            </div>
            <div className=" flex flex-col ">
              <label className="">Token Number</label>
              <input
               
                className="bg-gray-50 border-2 border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-72"
                {...register("token", { required: true })}
              />
              {errors.token && <p className="text-red-500">Token required</p>}
            </div>
            <div className=" text-center mt-4 mb-2">
              <Button type="submit" className=" px-6 mx-auto">
                {" "}
                Submit
              </Button>
            </div>
          </div>
        </form>
        <div className="flex flex-col ml-2">
          <div className="m-2  flex gap-2">
            {incrementAmounts?.map((amount) => (
              <button
                className="btn btn-outline w-fit text-lg"
                onClick={(e) =>
                  setValue(
                    "amount",
                    Number(getValues("amount")) + Number(amount?.value)
                  )
                }
              >
                +{amount?.value}
              </button>
            ))}
          </div>
          <div className="m-2 space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                onClick={(e) =>
                  setValue(
                    "amount",
                    Number(getValues("amount")) +
                      Number(
                        (i + 1) * vehicleDetails?.liveVehicle?.quoteIncreament
                      )
                  )
                }
                className="btn text-lg bg-black"
                key={i}
                value={(i + 1) * vehicleDetails?.liveVehicle?.quoteIncreament}
              >
                {Number(getValues("amount")) +
                  Number(
                    (i + 1) * vehicleDetails?.liveVehicle?.quoteIncreament
                  )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-2 border-black rounded-lg p-2 flex items-center bg-white font-medium px-6 shadow-lg">
        <div className="flex w-44 flex-col space-y-1">
          <div>
            <label>Start Price</label>
            <input
              className="border-2 pl-2 w-full rounded-lg border-black"
              defaultValue={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
            ></input>
          
          </div>
          <Button
              progress={90} color="green"
              className=" border-2  text-black  border-black "
              onClick={() => handleStartPrice()}
            >
              Change Start Price
            </Button>
          <Button
            progress={90} color="blue"
            className=" border-2 border-black"
            href={`/edit-vehicle/${vehicleDetails?.liveVehicle?.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vehicle Details
          </Button>
          <Button 
            className="btn-primary border-2 border-black" onClick={() => handleEvent()}>
            Pause Event
          </Button>
          <Button
         color="dark"
            className=" border-2 border-black"
            href={`/projecter-view/${vehicleDetails?.liveVehicle?.event.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Projecter View
          </Button>
        </div>
      </div>
      <div className="border-2 border-black rounded-lg p-2 flex flex-col pt-4 gap-3 px-4 shadow-lg bg-white ">
        <label>
          Current Status:{" "}
          <p className="font-bold">{vehicleDetails?.liveVehicle?.bidStatus}</p>
        </label>
        {vehicleDetails?.liveVehicle?.bidStatus !== "pending" && (
          <button className="btn btn-success " onClick={() => handlePending()}>
            Pending
          </button>
        )}
        {vehicleDetails?.liveVehicle?.bidStatus !== "approved" && (
          <Button color="dark"
            className="mt-3" onClick={() => handleApproved()}>
            PROPOSED FOR SALE
          </Button>
        )}
        {vehicleDetails?.liveVehicle?.bidStatus !== "fulfilled" && (
          <Button color="success"
            className=""
            onClick={() => handleFullfilled()}
          >
            Fullfilled
            </Button>
        )}
        {vehicleDetails?.liveVehicle?.bidStatus !== "declined" && (
          <Button color="failure"
            className="" onClick={() => handleDeclined()}>
            Declined
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
