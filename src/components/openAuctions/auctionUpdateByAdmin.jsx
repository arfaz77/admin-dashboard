import { useState, useEffect } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GrLinkPrevious,GrLinkNext } from "react-icons/gr";
import { useParams } from "react-router-dom";

import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import moment from "moment";
import {
  useOpenAuctionVehiclesQuery,
 
  useQueryQuery,


  useEditEventMutation,
  useUpdateVehicleMutation,
  useBidDetailsPerVehicleQuery,
  useVehiclePerEventQuery,

} from "../../utils/graphql";
import ParticipantsList from "./participantList";
import VehicleDetails from "./createBid";
import Swal from "sweetalert2";
import Deletedbidtable from "../bids/deletedbidtable";
import { DownloadBidHistory } from "../bids/bidsheet";



const AuctionUpdateByAdmin = () => {
  const { id } = useParams();
 
 
  const [liveItem, setLiveItem] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
// console.log("live item",liveItem)
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const [lot,setLot]=useState(0)


  const [pauseEvent] = useEditEventMutation({ variables: { where: { id } } });
  const [update]=useUpdateVehicleMutation({variables:{id}})
  const {data:liveData} = useBidDetailsPerVehicleQuery({variables:{where:{id:liveItem?.id}}})

  let circleClasses = "inline-block  rounded-full  mx-auto";

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((tic) => tic + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: timeData, refetch: serverRefetch } = useQueryQuery(
    {},
    { refetchInterval: 60000 }
  );


  useEffect(() => {
    if (timeData && timeData?.time) {
      setTick(0);
      setserverTime(timeData?.time);
    }
  }, [timeData]);

  const { data, isLoading, refetch } = useOpenAuctionVehiclesQuery(
    {
      variables: {
        where: {
          event: {
            id: {
              equals: id ? id.toString() : "",
            },
          },
        },
      },
    },
    {
      refetchInterval: 2000,
      // enabled: id !== undefined && id != ""
    }
  );


  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      serverRefetch();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [serverRefetch]);

  const handleEventActivate = async () => {
    const response = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (response.isConfirmed) {
      pauseEvent({ variables: { data: { status: "active" } } }).then(
        (result) => {
        }
      );
    }
  };



  function compare(a, b) {
    if (a.bidStartTime < b.bidStartTime) {
      return -1;
    }
    if (a.bidStartTime > b.bidStartTime) {
      return 1;
    }
    return 0;
  }
   
  useEffect(() => {
    if (data && data.vehicles.length > 0) {
      const live = data.vehicles.find(
        (element) => element.vehicleEventStatus === "live"
      );
      const upcomingVehicles = data.vehicles.filter(
        (element) => element.vehicleEventStatus === "upcoming"
      );
      const sortedUpcoming = upcomingVehicles.sort(compare);
      setUpcoming(sortedUpcoming);
      //   bidStartTime;
      if (live) {
        setLiveItem(live);
      } else {
        setLiveItem(null);
      }
    } else {
      setLiveItem(null);
    }
  }, [data]);

  function SecondsLeft() {
    // expiry - server + tick
    try {
      if (liveItem) {

        const expiryTime = moment(liveItem.bidTimeExpire);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = expiryTime.diff(currentTime, "seconds");

        if (diff > 0) return moment.utc(diff * 1000).format("HH:mm:ss");
        else return "00:00:00";
      }
      return "00:00:00";
    } catch {
      return "00:00:00";
    }
  }




  function upcomingSecondsLeft() {
    let noUpcoming = "no upcoming left";
    try {
      if (upcoming[0]) {
        let count = upcoming[0].length;
        let string = count + "";

        const startTime = moment(upcoming[0].bidStartTime);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = startTime.diff(currentTime, "seconds");
  if (diff > 0) {
    const duration = moment.duration(diff * 1000);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    const formattedDuration = `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return formattedDuration;
  }
        else return "00:00:00";
      }
      return noUpcoming;
    } catch (error) {

      return "00:00:00";
    }
  }
const handleNextVehicle=async()=>{
  const response = await Swal.fire({
    title: "Would you like to proceed to the next vehicle?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
  if (response.isConfirmed) {

const response=await  vehicleDetails(data)
const firstVehicle=response?.sortedVehicles.find((vehicle)=>new Date(vehicle.bidStartTime)>new Date())


 update({variables:{data:{bidTimeExpire:new Date().toISOString()},where:{id:response?.liveVehile?.id}}}).then((result)=>
  update({variables:{data:{bidStartTime:new Date().toISOString()},where:{id:firstVehicle?.id}}}).then((result)=>console.log(result))
 )
  }
}
const handlePreviousVehicle = async () => {
  let lot = liveItem?.lotNumber;
  if(lot===1){
    Swal.fire({icon:"warning",title:"There is no Previous Vehicle"})
    return
  }
 
 const response=await Swal.fire({icon:"question",
  title:"Would you like to return to the previous vehicle ?",
  showCancelButton: true,
  confirmButtonText: "Yes",
  cancelButtonText: "Cancel",
})

if (response.isConfirmed) {
try {
    // Get the lot number of the current live item

    // Find the last completed vehicle by the previous lot number
    let lastCompleted = data?.vehicles.filter((vehicle) => vehicle?.lotNumber === lot - 1);
    console.log("last completed", lastCompleted);

    if (lastCompleted && lastCompleted.length > 0) {
      // Calculate the difference in milliseconds between bidTimeExpire and bidStartTime of the live item
      const diff = new Date(liveItem?.bidTimeExpire).getTime() - new Date(liveItem?.bidStartTime).getTime();

// update live vehicle bid time
await update({
  variables: {
    where: { id: liveItem?.id },
    data: {
      bidStartTime: new Date(new Date(liveItem?.bidStartTime).getTime() + diff),
      bidTimeExpire: new Date(new Date(liveItem?.bidTimeExpire).getTime() + diff)
    }
  }
});



      // Update the last completed vehicle's bid times
      await update({
        variables: {
          where: { id: lastCompleted[0]?.id },
          data: {
            bidStartTime: liveItem?.bidStartTime,
            bidTimeExpire: liveItem?.bidTimeExpire,
          }
        }
      });

      console.log("diff", diff);

      // Update the upcoming vehicles' bid times
      for (const vehicle of upcoming) {
        const updatedBidStartTime = new Date(new Date(vehicle?.bidStartTime).getTime() + diff);
        const updatedBidTimeExpire = new Date(new Date(vehicle?.bidTimeExpire).getTime() + diff);

        await update({
          variables: {
            data: {
              bidStartTime: updatedBidStartTime.toISOString(),
              bidTimeExpire: updatedBidTimeExpire.toISOString(),
            },
            where: { id: vehicle?.id }
          }
        });
      }
Swal.fire({icon:'success',title:"Upcoming vehicles updated successfully."})
      console.log("Upcoming vehicles updated successfully.");
    } else {
      console.log("No last completed vehicle found.");
      Swal.fire({icon:"warning",title:"This is the first vehicle"})
    }
  } catch (err) {
    console.log("Error", err);
  }
}
  
};

// Ensure 'update' is an async function available in the scope to handle the GraphQL mutations

const handleReport = () => {
console.log("live ",liveItem?.id,liveData)
   DownloadBidHistory(liveData?.vehicle);
};
 

  return (
    <div className="bg-custom-radial">
      {liveItem?.event?.status !== "pause" ? (
        <div className="w-full ">
          {liveItem ? (
            <>
              <div className="py-10 mx-10 ">
          {/* Page header */}
          <div className="grid grid-cols-3 items-center justify-center">
            <div className="flex items-center space-x-5 border-2 border-black p-4 rounded-lg  w-fit bg-white">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Open Auction
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  <span className=""> LotNo:</span> #{" "}
                  {liveItem.lotNumber}
                </p>
                <h1>Reg. No # <span className="font-bold">{liveItem?.registrationNumber}</span></h1>
              </div>
            </div>
            <div className="   px-4 py-5  sm:rounded-lg sm:px-6 border-2 border-black space-y-2 w-fit place-content-center bg-white">
              <div className=" justify-between">
                <div className="grid grid-cols-2 items-center gap-2 ">
                  <h2 className="text-lg font-medium text-gray-900">
                    Start Price :
                  </h2>
                  <p className="text-2xl font-bold text-red-600">
                    {liveItem?.startBidAmount?.toLocaleString()}/-
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-2 ">
                <h2 className="text-lg font-medium text-gray-900">
                  Current Bid Amount :
                </h2>
                <p className="text-2xl font-bold text-red-600">
                  {liveItem.currentBidAmount.toLocaleString()}/-
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 mt-4 sm:mt-0">
         <button className="p-2 btn btn-outline  flex gap-2" onClick={()=>handleReport()}>
          <span className="  font-bold">
         BID SHEET</span>  <FaCloudDownloadAlt  className="h-8 w-8" /></button>
              {CountdownTimer(SecondsLeft())}
              <div className="flex justify-end space-x-2">
            <button className="p-2 bg-red-700 btn text-white   font-bold flex gap-2 text-lg" 
            onClick={()=>handlePreviousVehicle()} ><GrLinkPrevious className="h-7 w-7"/><span>PREV</span> </button>
       
              <button className="p-2 bg-blue-700 btn text-lg text-white   font-bold flex justify-between gap-2"
               onClick={()=>handleNextVehicle()} >NEXT <GrLinkNext className="h-7 w-7"/></button>
         </div>
            </div>
          </div>

          {/* <section className="space-y-2 flex w-full "> */}

          {/* </section> */}
        </div>
              <VehicleDetails liveVehicle={liveItem} timedata1={timeData} />
              <ParticipantsList vehicleId={liveItem?.id} />
              
              <Deletedbidtable vehicleId={liveItem?.id}/>
            </>
          ): counterLeftUpcoming(upcomingSecondsLeft())}
        </div>
      ) : (
        <div className="h-96  text-center   space-y-20 mt-10">
          <h1 className="  align-middle text-red-500">
            "This Event Is Not Active"
          </h1>
          <button
            className="btn btn-info"
            onClick={() => handleEventActivate()}
          >
            Activate Event
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionUpdateByAdmin;
function counterLeftUpcoming(hhmmss) {
 
  if (hhmmss === "no upcoming left") {
    return (
      <div
        className="flex justify-center items-center pl-80 font-extrabold  animate-pulse text-black-600 sm:text-xl md:text-2xl lg:text-3xl "
        style={{ minHeight: "80vh" }}
      >
        NO MORE UPCOMING VECHILES{" "}
      </div>
    );
  } else {
    const timeArray = hhmmss.split(":");

    return (
      <div
        className=" pl-96  flex justify-center items-center "
        style={{ minHeight: "80vh" }}
      >
        <div className="w-72 text-blue-700">
          <div className="text-center text-3xl text-black font-extrabold uppercase">
            Next vehicle will be in
          </div>
          <div className=" text-2xl text-center flex w-full items-center justify-center">
        {timeArray[0]>0 && <> <div className="w-24 mx-2 p-2">
              <div className="font-semibold text-7xl leading-none">
                {timeArray[0]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Days
              </div>
              
            </div><div className="text-8xl pb-10">:</div></>}
            <div className="w-24 mx-2 p-2">
              <div className="font-semibold text-7xl leading-none">
                {timeArray[1]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Hours
              </div>
            </div>
            <div className="text-8xl pb-10">:</div>
            <div className="w-24 mx-2 p-2">
              <div className="font-mono text-7xl leading-none">
                {timeArray[2]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Minutes
              </div>
            </div>
            <div className="text-8xl pb-10">:</div>
            <div className="w-24 mx-2 p-2">
              <div className="font-mono text-7xl leading-none">
                {timeArray[3]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function CountdownTimer(hhmmss) {
  const timeArray = hhmmss.split(":");

  return (
    <div className="w-72 text-indigo-500">
      <div className="text-center text-md font-bold  capitalize">Vehicle Live Time</div>
      <div className="text-2xl text-center flex w-full items-center justify-center">
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-md leading-none">{timeArray[0]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Hours
          </div>
        </div>
        <div className="text-xl pb-10">:</div>
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-md leading-none">{timeArray[1]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Minutes
          </div>
        </div>
        <div className="text-xl pb-10">:</div>
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-md leading-none">{timeArray[2]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
const vehicleDetails=async(data)=>{
  const liveVehile= data?.vehicles?.find((vehicle)=>vehicle?.vehicleEventStatus==='live')
const sortedVehicles = [...data?.vehicles]?.sort((a, b) => {
  const dateA =new Date(a.bidTimeExpire);
  const dateB =new Date(b.bidTimeExpire);
 

  return dateA - dateB;
  
});

return {sortedVehicles,liveVehile}
}