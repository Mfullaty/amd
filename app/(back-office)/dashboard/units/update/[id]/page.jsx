import { getData } from '@/lib/getData'
import React from 'react'
import NewUnit from '../../new/page';

export default async function Update({params: {id}}) {
  const data = await getData(`units/${id}`);
  console.log(data);
  return <NewUnit initialValues={data} isUpdate={true}/>
}
