export type DayOperatingHours = {
  open: boolean;
  start: string | null;
  end: string | null;
};

export type OperatingHours = {
  monday: DayOperatingHours;
  tuesday: DayOperatingHours;
  wednesday: DayOperatingHours;
  thursday: DayOperatingHours;
  friday: DayOperatingHours;
  saturday: DayOperatingHours;
  sunday: DayOperatingHours;
};

export type CenterInfo = {
  id: number;
  center_name: string;
  address: string;
  address_detail: string | null;
  center_phone: string;
  mobile_phone: string;
  business_number: string;
  operating_hours: OperatingHours;
  updated_at: string;
};
