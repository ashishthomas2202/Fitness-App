const deleteMeasurement = async (id) => {
    try {
      const response = await fetch(`/api/record/measurement/${id}/delete`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete measurement error:', error);
      return false;
    }
  };