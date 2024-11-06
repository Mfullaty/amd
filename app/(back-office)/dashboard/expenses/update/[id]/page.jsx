import { getData } from '@/lib/getData'
import React from 'react'
import NewExpense from '../../new/page';

export default async function Update({params: {id}}) {
  const data = await getData(`expenses/${id}`);
  console.log(data);
  return <NewExpense initialValues={data} isUpdate={true}/>
}
