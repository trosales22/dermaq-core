import { FC, useEffect, useState } from "react";
import { format } from 'date-fns';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from 'components/ui/components'
import { clinicSessionSchema, ClinicSessionFormData } from "schemas/clinicSessionSchema";
import { toast } from 'react-toastify';
import { useCreateClinicSessionMutation } from "hooks/clinic-session";
import { useQueryClient } from "@tanstack/react-query";
import { DayPicker } from 'react-day-picker';

interface AddClinicSessionFormProps {
  onClose: () => void;
}

const AddClinicSessionForm: FC<AddClinicSessionFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient()
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [showSessionDatePicker, setShowSessionDatePicker] = useState<boolean>(false);

  const {
    setValue,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicSessionFormData>({
    resolver: zodResolver(clinicSessionSchema)
  });

  useEffect(() => {
    setValue('session_date', formatDate(sessionDate))
  }, [])

  const { mutate: createClinicSession, isPending: isCreateClinicSessionLoading } = useCreateClinicSessionMutation({
    onSuccess: () => {
        toast.success("Created clinic session successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "colored"
        });

        queryClient.invalidateQueries({ queryKey: ['CLINIC_SESSION_LIST'] });

        onClose();
        reset();
    },
    onError: () => {}
  });

  const onSubmit = (data: ClinicSessionFormData) => {
    createClinicSession(data)
  }

  const formatDate = (date?: Date) => (date ? format(date, 'yyyy-MM-dd') : 'Select Date');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block text-sm font-medium">Session Date</label>
      <button
        type="button"
        className="w-full px-4 py-2 border border-gray-300 rounded text-left"
        onClick={() => setShowSessionDatePicker(true)}
      >
        {formatDate(sessionDate)}
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

      <div className="md:col-span-3 flex justify-end">
        <Button variant="primary" type="submit" disabled={isCreateClinicSessionLoading}>{isCreateClinicSessionLoading ? 'Creating..' : 'Create'}</Button>
      </div>
    </form>
  );
};

export default AddClinicSessionForm;
