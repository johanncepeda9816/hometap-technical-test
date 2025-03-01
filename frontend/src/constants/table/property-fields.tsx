import {
  Home,
  Calendar,
  Square,
  Trees,
  Bed,
  Bath,
  DoorOpen,
  Droplets,
  DollarSign,
} from "lucide-react";

const fieldGroups = [
  {
    title: "Basic Information",
    fields: [
      {
        key: "property_type",
        label: "Property Type",
        icon: <Home size={16} />,
      },
      {
        key: "year_built",
        label: "Year Built",
        icon: <Calendar size={16} />,
      },
      {
        key: "square_footage",
        label: "Square Footage",
        icon: <Square size={16} />,
      },
      {
        key: "lot_size_acres",
        label: "Lot Size (acres)",
        icon: <Trees size={16} />,
      },
    ],
  },
  {
    title: "Rooms",
    fields: [
      {
        key: "bedrooms",
        label: "Bedrooms",
        icon: <Bed size={16} />,
      },
      {
        key: "bathrooms",
        label: "Bathrooms",
        icon: <Bath size={16} />,
      },
      {
        key: "room_count",
        label: "Total Rooms",
        icon: <DoorOpen size={16} />,
      },
    ],
  },
  {
    title: "Additional Information",
    fields: [
      {
        key: "septic_system",
        label: "Septic System",
        icon: <Droplets size={16} />,
      },
      {
        key: "sale_price",
        label: "Sale Price",
        icon: <DollarSign size={16} />,
        formatter: (value: string) =>
          value ? `$${Number(value).toLocaleString()}` : "N/A",
      },
    ],
  },
];

export { fieldGroups };
