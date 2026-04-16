// Maps GeoJSON feature names (from public/india-states.geojson) to the
// two-letter codes used by state-census.ts and loksabha.ts.
//
// Source: udit-001/india-maps-data (district-level, dissolved to state-level
// via mapshaper). Respects India's official boundary claim (J&K includes
// PoK; Aksai Chin included in Ladakh). Post-2019 J&K/Ladakh split is present.
//
// Special cases:
// - Telangana is a separate feature in the GeoJSON but state-census.ts
//   merges it into Andhra Pradesh. We map Telangana → AP so both features
//   paint with the same value.
// - Dadra & Nagar Haveli and Daman & Diu merged into one UT in 2020. The
//   GeoJSON reflects the merger; we map it to DN (the larger predecessor).

export const GEO_NAME_TO_CODE: Record<string, string> = {
  'Andaman and Nicobar Islands':               'AN',
  'Andhra Pradesh':                            'AP',
  'Arunachal Pradesh':                         'AR',
  'Assam':                                     'AS',
  'Bihar':                                     'BR',
  'Chandigarh':                                'CH',
  'Chhattisgarh':                              'CG',
  'Dadra and Nagar Haveli and Daman and Diu':  'DN',
  'Delhi':                                     'DL',
  'Goa':                                       'GA',
  'Gujarat':                                   'GJ',
  'Haryana':                                   'HR',
  'Himachal Pradesh':                          'HP',
  'Jammu and Kashmir':                         'JK',
  'Jharkhand':                                 'JH',
  'Karnataka':                                 'KA',
  'Kerala':                                    'KL',
  'Ladakh':                                    'LA',
  'Lakshadweep':                               'LD',
  'Madhya Pradesh':                            'MP',
  'Maharashtra':                               'MH',
  'Manipur':                                   'MN',
  'Meghalaya':                                 'ML',
  'Mizoram':                                   'MZ',
  'Nagaland':                                  'NL',
  'Odisha':                                    'OD',
  'Puducherry':                                'PY',
  'Punjab':                                    'PB',
  'Rajasthan':                                 'RJ',
  'Sikkim':                                    'SK',
  'Tamil Nadu':                                'TN',
  'Telangana':                                 'AP',  // merged into AP in our dataset
  'Tripura':                                   'TR',
  'Uttar Pradesh':                             'UP',
  'Uttarakhand':                               'UK',
  'West Bengal':                               'WB',
};

export const GEOJSON_URL = '/india-states.geojson';

export interface IndiaGeoFeature {
  type: 'Feature';
  properties: { st_nm: string };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface IndiaGeo {
  type: 'FeatureCollection';
  features: IndiaGeoFeature[];
}
