import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAddLocationMutation, useStatesQuery } from "../../utils/graphql";
import States from "../../pages/states";

const AddLocation = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [createLocation, { loading, error }] = useAddLocationMutation();

  const states = useStatesQuery();

  console.log("888888", states);

  const onSubmit = async (dataOnSubmit) => {
    console.log("reachws hwew");
    console.log(dataOnSubmit, "onSubmit");
    const data = {
      country: dataOnSubmit?.country,
      name: dataOnSubmit?.name,
      state: { connect: { id: dataOnSubmit?.state } },
    };

    console.log("the data that needs to be sented to server", data);
    try {
      const result = await createLocation({ variables: { data } });
      console.log("RESULT", result);
    } catch (error) {
      console.log("DATABASE ERROR", error.stack);
    }

    // console.log("DATA LOADED TO SERVER",data);

    setSuccessMsg("User registration is successful.");
    reset();
  };

  return (
    <div className="w-full max-w-xs relative ml-50">
      <div className="absolute top-3 left-10 ">
        <label htmlFor="my-modal-3" className="btn  btn-outline btn-secondary">
          Add Location
        </label>
      </div>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-box relative w-96">
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <div className="flex flex-col">
              <label htmlFor="">City</label>
              <input
                {...register("name", { required: true })}
                className="input input-bordered input-secondary  "
              />
              <p className="text-red-500">
                {" "}
                {errors.name && <span> Name is required</span>}
              </p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Country</label>
              <input
                {...register("country", { required: true })}
                className="input input-bordered input-secondary  "
              />
              <p className="text-red-500">
                {" "}
                {errors.country && <span>Country name is required</span>}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="t" htmlFor=" ">
                State{" "}
              </label>
              <div className="absolute inset-y-12   right-[595px] flex items-center ">
                <div className="h-5 w-1 border bg-gray-400 "></div>
              </div>
              <select
                {...register("state", { required: true })}
                placeholder="select"
                className="input input-bordered input-secondary  "
              >
                <option value="">Select </option>
                {states?.data?.states.map((item) => (
                  <option key={item.name} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="text-red-500">
                {" "}
                {errors.state && <span>State required</span>}
              </p>
            </div>
            <div className=" flex justify-center space-x-5 my-5">
              <button type="submit" className="btn btn-outline btn-secondary">
                Add Location
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
