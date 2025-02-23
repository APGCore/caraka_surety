export interface Principal {
  id: string;
  province_id?: number;
  regency_id?: number;
  district_id?: number;
  village: string;
  name: string;
  address: string;
  postal_code: string;
  telephone?: number;
  fax: string;
  npwp?: number;
  nib?: string;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone?: number;
  commissioner: string;
  year_established?: number;
  est_deed: string;
  last_deed: string;
  business_fields: string;
}
