export default ({ $axios }) => {
  $axios.onError((error) => {
    if (error.response.status !== 200) {
      alert(error.response.status + "" + error.response.data);
      console.log(error.response.data);
    }
  });
};
