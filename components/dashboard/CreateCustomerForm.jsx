'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import CustomerSelectionModal from '@/components/CustomerSelectionModal'
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextareaInput from '@/components/FormInputs/TextAreaInput'
import TextInput from '@/components/FormInputs/TextInput'
import DateTimeInput from '@/components/FormInputs/DateTimeInput'
import ImageInput from '@/components/dashboard/ImageInput'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CreateCustomerForm({
  items,
  customers,
  isUpdate,
  initialValues,
  fetching = true,
}) {
  const [imageUrls, setImageUrls] = useState(
    initialValues && initialValues.imageUrls ? initialValues.imageUrls : []
  )
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleUpload = (result) => {
    let uploadedUrls = []
    if (Array.isArray(result.info)) {
      uploadedUrls = result.info.map((info) => info.secure_url)
    } else {
      uploadedUrls = [result.info.secure_url]
    }
    setImageUrls((prevImageUrls) => [...prevImageUrls, ...uploadedUrls])
  }

  const { data: session } = useSession()
  const userName = session?.user?.name

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialValues })

  const [loading, setLoading] = useState(false)

  async function onSubmit(data) {
    data.imageUrls = imageUrls
    data.userId = selectedCustomer ? selectedCustomer.id : data.userId

    if (isUpdate) {
      makePutRequest(
        setLoading,
        `customers/${initialValues.id}`,
        data,
        'Customer',
        reset
      )
    } else {
      makePostRequest(setLoading, 'customers', data, 'Customer', reset)
      setImageUrls([])
      setSelectedCustomer(null)
    }
  }

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
    setValue('userId', customer.id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {!isUpdate && (
            <>
              {fetching ? (
                <Skeleton className="w-full block my-2 md:w-14 h-8 bg-muted-foreground" />
              ) : (
                <div>
                  <CustomerSelectionModal
                    customers={customers}
                    onSelect={handleCustomerSelect}
                  />
                  {selectedCustomer && (
                    <p className="mt-2">
                      Selected: {selectedCustomer.name} ({selectedCustomer.phone})
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {fetching ? (
            <Skeleton className="w-full my-2 md:w-14 h-8 bg-muted-foreground" />
          ) : (
            <SelectInput
              className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
              label="Select Item"
              name="itemId"
              register={register}
              options={items}
            />
          )}

          <TextInput
            className="w-full"
            label="Price Paid"
            name="price_paid"
            register={register}
            errors={errors}
            type="number"
          />

          <TextInput
            className="w-full"
            label="Price remain"
            name="price_remain"
            register={register}
            errors={errors}
            type="number"
          />

          <DateTimeInput
            label="Select Bringing Date"
            name="bringing_date"
            register={register}
            errors={errors}
          />

          <DateTimeInput
            label="Select Collection Date"
            name="collection_date"
            register={register}
            errors={errors}
          />

          <TextareaInput
            label="Item Description"
            name="description"
            register={register}
            isRequired={false}
            errors={errors}
          />

          <input
            type="hidden"
            name="added_by"
            {...register('added_by')}
            value={userName}
          />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Add additional details (optional)</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <ImageInput
              className="w-full"
              label="Upload Images (Optional)"
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              handleUpload={handleUpload}
              resource="customers"
              resourceId={initialValues?.id}
            />
          </CardContent>
        </Card>

        <SubmitButton
          isLoading={loading}
          title={isUpdate ? 'Update Customer' : 'New Customer'}
        />
      </form>
    </div>
  )
}