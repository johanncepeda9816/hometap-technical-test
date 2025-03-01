/* eslint-disable @typescript-eslint/no-explicit-any */
import { fieldGroups } from "../constants/table/property-fields";
import ProviderResponse from "../types/providers";
import { CacheBadge } from "./cache-badge";

interface ResultsTableProps {
  propertyData: ProviderResponse;
  address: string;
}

export const ResultsTable = ({ propertyData, address }: ResultsTableProps) => {
  const renderFieldValue = (
    item: any,
    field: {
      key: string;
      label: string;
      formatter?: (value: any) => string;
      icon?: React.ReactNode;
    }
  ) => {
    if (item && field.key in item) {
      if (field.formatter) {
        return field.formatter(item[field.key]);
      }
      return item[field.key] || "N/A";
    }
    return "N/A";
  };

  if (!propertyData || propertyData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
        <p>No property data available for this address.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Property Details for {address}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Data from multiple providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {propertyData.map((item, index) => {
          if (item.error) {
            return (
              <div
                key={index}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
              >
                <p className="font-medium">Error from {item.provider}</p>
                <p>{item.error}</p>
              </div>
            );
          }

          return (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{item.provider}</h4>
                <CacheBadge isCached={item.cached} />
              </div>

              <div className="divide-y">
                {fieldGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="px-4 py-3">
                    <h5 className="text-sm font-medium text-black-500 mb-2">
                      {group.title}
                    </h5>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {group.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex flex-col">
                          <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                            {field.icon && (
                              <span className="mr-2 text-gray-400">
                                {field.icon}
                              </span>
                            )}
                            {field.label}
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {renderFieldValue(item, field)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
