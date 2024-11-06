import { getData } from '@/lib/getData'
import React from 'react'
import NewCategory from '../../new/page';

export default async function Update({params: {id}}) {
  const data = await getData(`categories/${id}`);
  console.log(data);
  return <NewCategory initialValues={data} isUpdate={true}/>
}
