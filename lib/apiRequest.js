import { toast } from "sonner";

export async function makePostRequest(setLoading, endpoint, data, resourceName, reset){
    try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const response = await fetch(`${baseUrl}/api/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log(response);
          setLoading(false);
          reset();
          toast.success(`${resourceName} Saved!`)
        }else{
          setLoading(false);
          reset();
          toast.error(`Failed to create ${resourceName}`)
          
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        reset();
        toast.error(`Failed to create ${resourceName}`)
      }
}

// Put Request
export async function makePutRequest(setLoading, endpoint, data, resourceName){
  
    try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const response = await fetch(`${baseUrl}/api/${endpoint}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log(response);
          setLoading(false);
          toast.success(`${resourceName} Updated!`);
        }else{
          setLoading(false);
          
          toast.error(`Failed to Update ${resourceName}`)
          
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        
        toast.error(`Failed to Update ${resourceName}`)
      }
}

// Patch Request
export async function makePatchRequest(setLoading, endpoint, data, resourceName) { 
  try {
    setLoading(true); 
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/${endpoint}`, {
      method: "PATCH", // Key change: Use PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(response); 
      setLoading(false); 
      toast.success(`${resourceName} Updated!`);
    } else {
      setLoading(false); 
      toast.error(`Failed to update ${resourceName}`); 
    }
  } catch (error) {
    setLoading(false); 
    console.log(error);
    toast.error(`Failed to update ${resourceName}`); 
  }
}