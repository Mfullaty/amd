import { getData } from '@/lib/getData'
import React from 'react'
import NewCustomer from '../../new/page';

export default async function Update({params: {id}}) {
  const data = await getData(`customers/${id}`);
  return <NewCustomer initialValues={data} isUpdate={true}/>
}
