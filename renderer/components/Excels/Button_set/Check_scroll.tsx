import react, { useState } from "react";


type Props = {
   check_id : any;
   scroll_id : any; 
   title : any;


}


const click_event =()=>{
    const [checkedInputs, setCheckedInputs] = useState([]);

    const changeHandler = (checked, id) => {
      if (checked) {
        setCheckedInputs([...checkedInputs, id]);
      } else {
        // 체크 해제
        setCheckedInputs(checkedInputs.filter((el) => el !== id));
      }


}




}
const Checkbox_scroll =({check_id,scroll_id,title}:Props)=>{
<div>
{}


    <input type={"checkbox"}></input>
</div>




    return (
   <div></div>
    )  
}
export default Checkbox_scroll;
