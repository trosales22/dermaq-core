import { FC, useEffect, useState } from "react";
import { format } from 'date-fns';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Select, TextArea } from 'components/ui/components'
import { clinicSessionSchema, ClinicSessionFormData } from "schemas/clinicSessionSchema";
import { toast } from 'react-toastify';
import { useUpdateClinicSessionMutation } from "hooks/clinic-session";
import { useQueryClient } from "@tanstack/react-query";
import { DayPicker } from 'react-day-picker';
import { clinicSessionStatuses } from "utils/clinicSessionData";

interface UpdateClinicSessionFormProps {
  clinicSessionId: string | undefined;
  clinicSessionDetails: any
  onClose: () => void;
}

const UpdateClinicSessionForm: FC<UpdateClinicSessionFormProps> = ({ clinicSessionId, clinicSessionDetails, onClose }) => {
  const queryClient = useQueryClient()
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [showSessionDatePicker, setShowSessionDatePicker] = useState<boolean>(false);

  const {
    watch,
    setValue,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicSessionFormData>({
    resolver: zodResolver(clinicSessionSchema)
  });

  useEffect(() => {
    setValue('title', clinicSessionDetails?.title)
    setValue('description', clinicSessionDetails?.description)
    setValue('session_date', clinicSessionDetails?.session_date)
    setValue('start_time', clinicSessionDetails?.start_time)
    setValue('end_time', clinicSessionDetails?.end_time)
    setValue('status', clinicSessionDetails?.status?.code)
    setValue('max_slots', clinicSessionDetails?.max_slots)
  }, [clinicSessionDetails])

  const { mutate: updateClinicSession, isPending: isUpdateClinicSessionLoading } = useUpdateClinicSessionMutation({
    onSuccess: () => {
        toast.success("Update clinic session successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "colored"
        });

        queryClient.invalidateQueries({ queryKey: ['CLINIC_SESSION_LIST'] });
        queryClient.invalidateQueries({ queryKey: ['CLINIC_SESSION_SHOW', clinicSessionId] });

        onClose();
        reset();
    },
    onError: () => {}
  });

  const onSubmit = (data: ClinicSessionFormData) => {
    updateClinicSession({
      clinicSessionId,
      payload: data
    })
  }

  const formatDate = (date?: Date) => (date ? format(date, 'yyyy-MM-dd') : 'Select Date');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        label="Title" 
        type="text" 
        placeholder="Enter title" 
        fieldset 
        legend="Title" 
        requirementLabel={errors.title && errors.title.message} 
        requirementColor="text-red-500"
        {...register("title")}
      />

      <TextArea 
        className="md:col-span-2" 
        label="Description" 
        fieldset 
        legend="Description" 
        width="full" 
        optionalLabel={errors.description ? errors.description.message : "Optional"} 
        optionalLabelColor={errors.description ? 'text-red-500' : "text-black"} 
        {...register("description")}
      />

      <label className="block text-sm font-medium">Session Date</label>
      <button
        type="button"
        className="w-full px-4 py-2 border border-gray-300 rounded text-left"
        onClick={() => setShowSessionDatePicker(true)}
      >
        {watch().session_date}
      </button>
      <p className={`text-xs text-red-500`}>{errors.session_date && errors.session_date.message}</p>

      { showSessionDatePicker && (
        <DayPicker
          mode="single"
          selected={sessionDate}
          onSelect={(date) => {
            setValue('session_date', formatDate(date))
            setSessionDate(date);
            setShowSessionDatePicker(false);
          }}
          disabled={{ before: new Date() }}
        />
      )}
      
      <Input 
        label="Max Slot" 
        type="number" 
        placeholder="Input Max Slot" 
        fieldset 
        legend="Max Slot" 
        requirementLabel={errors.max_slots && errors.max_slots.message} 
        requirementColor="text-red-500"
        {...register("max_slots", { valueAsNumber: true })}
      />

      <Input 
        label="Start Time" 
        type="time" 
        placeholder="Select Start Time" 
        fieldset 
        legend="Start Time"
        requirementLabel={errors.start_time && errors.start_time.message} 
        requirementColor="text-red-500"
        {...register("start_time")}
      />

      <Input 
        label="End Time" 
        type="time" 
        placeholder="Select End Time" 
        fieldset 
        legend="End Time"
        requirementLabel={errors.end_time && errors.end_time.message} 
        requirementColor="text-red-500"
        {...register("end_time")}
      />

      <Select
        {...register('status')}
        legend="Status"
        helperText="Required"
        helperColor={errors.status ? 'text-red-500' : "text-black"}
        defaultValue=""
        options={clinicSessionStatuses}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <div className="md:col-span-3 flex justify-end">
        <Button variant="primary" type="submit" disabled={isUpdateClinicSessionLoading}>{isUpdateClinicSessionLoading ? 'Updating..' : 'Update'}</Button>
      </div>
    </form>
  );
};

export default UpdateClinicSessionForm;
