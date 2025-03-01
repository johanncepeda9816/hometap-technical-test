const fieldGroups = [
  {
    title: "Basic Information",
    fields: [
      { key: "property_type", label: "Property Type" },
      { key: "year_built", label: "Year Built" },
      { key: "square_footage", label: "Square Footage" },
      { key: "lot_size_acres", label: "Lot Size (acres)" },
    ],
  },
  {
    title: "Rooms",
    fields: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "room_count", label: "Total Rooms" },
    ],
  },
  {
    title: "Additional Information",
    fields: [
      { key: "septic_system", label: "Septic System" },
      {
        key: "sale_price",
        label: "Sale Price",
        formatter: (value: string) =>
          value ? `$${Number(value).toLocaleString()}` : "N/A",
      },
    ],
  },
];

export { fieldGroups };
