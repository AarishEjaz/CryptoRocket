import { getSponsorId } from "../api/member.api"; // Adjust the import path if needed

let debounceTimer = null;

export const validateSponsorInput = (inputValue, setStatus=null, setName=null) => {
  // Clear previous timer
  if (debounceTimer) clearTimeout(debounceTimer);

  // Start new debounce
  debounceTimer = setTimeout(async () => {
    if (inputValue.length >= 6 && inputValue.length <= 12) {
      try {
        const res = await getSponsorId(inputValue);

        if (res?.data && res?.data?.name) {
          setStatus("valid");
          setName(res?.data);
        } else {
          setStatus("invalid");
          setName("");
        }
      } catch (err) {
        console.error("Sponsor validation failed:", err);
        setStatus("invalid");
        setName("");
      }
    } else {
      setStatus(null);
      setName("");
    }
  }, 500);
};
