import { useState, forwardRef, useImperativeHandle } from "react";

type Props ={
File_path : any;

}



const Excel_List=({File_path}:Props)=>{
    const [file_list, setfile_list] = useState([]);
    const [Input_Selected, setInput_Selected] = useState({});
    const [Input_Checked, setInput_Checked] = useState({});
    const [filepath, setfilepath] = useState(null);
 
    
  
    function readExcel(event) {
event.preventDefault();
   console.log("dddd");
        const XLSX = require("xlsx");

         let reader = new FileReader();
       reader.readAsBinaryString(File_path);
          reader.onload = function () {
             let data = reader.result;
             let workBook = XLSX.read(data, { type: 'binary' });
              console.log(workBook.SheetNames)  
              workBook.SheetNames.forEach(function (sheetName) {
                
                 // console.log('SheetName: ' + sheetName);
                 let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
               // console.log ("ddddd"+Object.keys(rows[0]));
                 let rows_arr = Object.keys(rows[0])
                 console.log(rows_arr);
                setfile_list (rows_arr);
                
             
     
                for (let info in rows_arr) {
                 Input_Checked[`${rows_arr[info]}`]= "true";
                 Input_Selected[`${rows_arr[info]}`] = "INFO";
                 setInput_Checked(Input_Checked)
                   setInput_Selected(Input_Selected)  
                };
                console.log("input_checked : ",Input_Checked,"input_select",Input_Selected);
                }) 

            }
        }
        const Click_Select = event =>{

            const id = event.target.id;
            const value = event.target.value;
            Input_Selected[id] = value;
            setInput_Selected(Input_Selected);
            
            
            
              console.log(Input_Selected)
            
              
             }
             const Click_Check = event =>{
             
              const id = event.target.id;
              const checked = event.target.checked;
              Input_Checked[id] = checked;
              setInput_Checked(Input_Checked);
              console.log("input_checked : ",Input_Checked,"input_select",Input_Selected);
             }
            const Delete_Button = (event) => {
              event.preventDefault();
              const value = event.target.value;
                setfile_list(file_list.filter(index=> index!==value));      
                delete Input_Checked[value];
                setInput_Checked(Input_Checked)
                delete Input_Selected[value]
                setInput_Selected(Input_Selected)
             console.log(Input_Checked,Input_Selected);   
            }
            
    return(
<>


<div >
        <label role="list" className=" font-bold text-sm ">

{file_list.map((menu, index) => (
<div className='inline-flex items-center rounded-l-md border border-r-1 border-gray-300 bg-gray-50' >
  <div> 
    <button value={menu} id={`${menu}`} onClick ={Delete_Button}></button>
  </div>

   Mandatory
   <input onChange={Click_Check} className='' type={"checkbox"} id={`${menu}`}></input>
 {index}  
 
 <div className='white-space: pre-line'>{menu}</div>
  <select  onChange={Click_Select} name="Sel_op" id={`${menu}`} className='sm:text-sm text-sm'>
			<option  value="INFO">INFO</option>
			<option  value="TIME_STAMP">TIME_STAMP</option>
			<option  value="FEATURE">FEATURE</option>
      <option  value="LABEL">LABEL</option>
		</select>
    <br />
    </div>))}
</label></div>

  <div className='white-space: pre-line'>{file_list}</div> 
</>
    )
}
    

export default Excel_List;
