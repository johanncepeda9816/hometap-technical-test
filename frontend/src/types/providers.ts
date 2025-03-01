import { ErrorResponse } from "./errors";

export interface Provider1Response {
  data: {
    id: string;
    formattedAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    latitude: number;
    longitude: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    lotSizeSqFt: number;
    yearBuilt: number;
    assessorID: string;
    legalDescription: string;
    subdivision: string;
    zoning: string;
    lastSaleDate: string;
    lastSalePrice: number;
    hoa: {
      fee: number;
    };
    features: {
      architectureType: string;
      cooling: boolean;
      coolingType: string;
      exteriorType: string;
      fireplace: boolean;
      fireplaceType: string;
      floorCount: number;
      foundationType: string;
      garage: boolean;
      garageSpaces: number;
      garageType: string;
      heating: boolean;
      heatingType: string;
      pool: boolean;
      poolType: string;
      roofType: string;
      roomCount: number;
      unitCount: number;
      viewType: string;
      septicSystem: boolean;
    };
    taxAssessments: {
      [year: string]: {
        year: number;
        value: number;
        land: number;
        improvements: number;
      };
    };
    propertyTaxes: {
      [year: string]: {
        year: number;
        total: number;
      };
    };
    history: {
      [date: string]: {
        event: string;
        date: string;
        price: number;
      };
    };
  };
  cached: boolean;
}

export interface Provider2Response {
  data: {
    ID: string;
    NormalizedAddress: string;
    Address1: string;
    Address2: string | null;
    City: string;
    State: string;
    PostalCode: string;
    ArchitecturalStyle: string;
    PropertyType: string;
    Bedrooms: number;
    Bathrooms: number;
    SquareFootage: number;
    LotSizeAcres: number;
    YearConstructed: number;
    HomeownerAssociationFee: number;
    LastSaleDate: string;
    LastSalePrice: number;
    RoomCount: number;
    UnitCount: number;
    GarageSpaces: number;
    GarageType: string;
    SepticSystem: boolean;
    Cooling: string;
    Heating: string;
    SalePrice: number;
  };
  cached: boolean;
}

interface NormalizedResponse {
  provider: "Provider 1" | "Provider 2";
  propertyType: string;
  yearBuilt: number;
  squareFootage: number;
  lotSizeAcres: number;
  bedrooms: number;
  bathrooms: number;
  roomCount: number;
  septicSystem: boolean;
  salePrice: number;
  cached: boolean;
  error: string;
}

type ProviderResponse = NormalizedResponse[] & ErrorResponse;

export default ProviderResponse;
