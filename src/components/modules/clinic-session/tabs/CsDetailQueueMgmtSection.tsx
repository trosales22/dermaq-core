import { useQueryClient } from "@tanstack/react-query";
import Wrapper from "components/Wrapper";
import { useShowReservationQueueInfo, useUpdateReservationMutation } from "hooks/reservation";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

interface CsDetailQueueMgmtSectionProps {
    clinicSessionId: string | undefined;
}

const CsDetailQueueMgmtSection: React.FC<CsDetailQueueMgmtSectionProps> = ({ clinicSessionId }) => {
  const queryClient = useQueryClient()
  const [currentRefNo, setCurrentRefNo] = useState(null)
  const [currentQueueNo, setCurrentQueueNo] = useState(0)
  const [lastQueueNo, setLastQueueNo] = useState(0)
  const [customerName, setCustomerName] = useState(null)
  
  const { data: response, isLoading, isError }: any = useShowReservationQueueInfo({
    clinicSessionId
  })

  const queueInfo = response?.data || null

  useEffect(() => {
    setCurrentQueueNo(queueInfo?.now_serving?.queue || 0)
    setCurrentRefNo(queueInfo?.now_serving?.refno)
    setCustomerName(queueInfo?.now_serving?.customer || 'Unknown')
    setLastQueueNo(queueInfo?.last_queue || 0)
  }, [queueInfo])

  const { mutate: updateReservation, isPending: isUpdateReservationLoading } = useUpdateReservationMutation({
    onSuccess: () => {
      toast.success("Update reservation successfully.");

      if(currentQueueNo < lastQueueNo){
        setCurrentQueueNo(prev => prev + 1);
      }

      queryClient.invalidateQueries({ queryKey: ['RESERVATION_LIST'] });
      queryClient.invalidateQueries({ queryKey: ['RESERVATION_QUEUE_INFO', clinicSessionId] });
    },
    onError: () => {}
  });

  const onNextQueueHandler = () => {
    updateReservation({
      clinicSessionId: clinicSessionId,
      reservationRefNo: currentRefNo,
      payload: {
        status: 'completed'
      }
    })
  };

  const onTagUnattendedHandler = () => {
    updateReservation({
      clinicSessionId: clinicSessionId,
      reservationRefNo: currentRefNo,
      payload: {
        status: 'unattended'
      }
    })
  }

  return (
    <Wrapper>
      <div className="w-full p-6 text-gray-900">
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white rounded-lg shadow-md w-full">
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          )}

          {isError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <p>There was an error loading the queue information. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && currentQueueNo > 0 && (
            <>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-extrabold text-blue-600">#{currentQueueNo}</span>
                <span className="text-lg font-medium text-gray-700">Now Serving</span>
              </div>
              <p className="text-lg font-medium text-gray-700"><b>Customer: </b>{customerName}</p>
              <div className="flex gap-6">
                <button 
                  className="btn bg-blue-500 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-sm hover:bg-blue-600 transition"
                  disabled={isUpdateReservationLoading}
                  onClick={onNextQueueHandler} 
                >
                  <ArrowRight /> Next
                </button>
              </div>

              <div className="flex gap-6 mt-2">
                <button 
                  className="btn bg-red-500 text-white px-6 py-3 text-lg font-medium rounded-lg shadow-sm hover:bg-red-600 transition"
                  disabled={isUpdateReservationLoading}
                  onClick={() => onTagUnattendedHandler()}
                >
                  Mark as Unattended
                </button>
              </div>

              <p className="text-lg text-gray-600 mt-2"><b>Last Queue Number:</b> {lastQueueNo !== null ? `#${lastQueueNo}` : "Fetching..."}</p>
            </>
          )}

          {currentQueueNo <= 0 && (
            <p className="text-lg text-red-600">You have reached the last queue number.</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default CsDetailQueueMgmtSection;