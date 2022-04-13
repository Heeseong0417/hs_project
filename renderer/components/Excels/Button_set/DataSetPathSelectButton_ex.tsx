import {useEffect, useRef, useState} from 'react';
import {UseFormSetValue} from 'react-hook-form';
import SelectSchemaFile from '../../project/SelectSchemaFile';
import {ValidationInputs} from '../print_test/TestMainList_ex';
import CSVReader from 'react-csv'
import Checkbox_scroll from './Check_scroll';
import ListSelectButton from '../../test/button/ListSelectButton';
import TestAside from '../print_test/TestAsice_ex';
import ExcelList from'../Button_set/Excel_List'
import { ipcRenderer } from 'electron';

type Props = {
  title: string;
  register: Function;
  register_name: string;
  ipcSendString: string;
  setValue?: UseFormSetValue<ValidationInputs>;
  setFile:any;
};
 
const DataSetPathSelectButton_ex = ({
  title,
  register,
  register_name,
  ipcSendString,
  setFile,
  setValue,
}: Props) => {
  // const [open, setOpen] = useState(false);
  const [file_list, setfile_list] = useState([]);
  const [fileCount, setFileCount] = useState();
  const [filepath, setfilepath] = useState();
  const [Input_Selected, setInput_Selected] = useState({});
  const [Input_Checked, setInput_Checked] = useState({});
  const [Algorithm, setAlgorithm] = useState([]);
  const SelectAlgorithm=[
    "Linear_Regression",
    "Random_Forest_Classifier",
    "SVC_Linear",
    "SVC_Poly",
    "SVC_RBF",
    "XGB_Classifier",
    "AdaBoost_Classifier"
]
  //const ref = useRef<HTMLInputElement>(null);
  /**useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('directory', '');
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);**/
  function readExcel(event) {

   const XLSX = require("xlsx");
   let input = event.target;
    let reader = new FileReader();
  reader.readAsBinaryString(input.files[0]);
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
            Input_Checked[`${rows_arr[info]}`]= "false";
            Input_Selected[`${rows_arr[info]}`] = "INFO";
            setInput_Checked(Input_Checked)
              setInput_Selected(Input_Selected)
              
           };
        
           console.log("input_checked : ",Input_Checked,"input_select",Input_Selected);
           
  
     
          }) 

    };
    
    console.log("콘솔실행");
  
   

 

}

const Click_Algorithm = event =>{
  const id = event.target.id;
  const checked = event.target.checked;

if(checked===true){
  Algorithm[id] = SelectAlgorithm[id];
}else{
  Algorithm.splice(id,1);
}

console.log(Algorithm);
setAlgorithm(Algorithm);
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
   const value = event.target.id;
    setfile_list(file_list.filter(index=> index!==value));      
    delete Input_Checked[value];
    setInput_Checked(Input_Checked);
    delete Input_Selected[value];
    setInput_Selected(Input_Selected);
 console.log(Input_Checked,Input_Selected);
}

 const Create_Json = event => {
  event.preventDefault();



  let today = new Date();
  let Input_Json = {
    "ProjectName" : title,
    "ExcelFilePath" : filepath,
    "CurrentDate" : today,
    "SelectAlgorithm": Algorithm,
    "Property" : {
      "INFO":{},"TIME_STAMP":{},"FEATURE":{},"LABEL":{}
    }
  }  

  
  Object.keys(Input_Checked).forEach(key =>{
    
    if(Input_Selected[key]==='INFO'){
      if(Input_Checked[key]=="true")
          Input_Json.Property.INFO[key] = Input_Checked[key];
    }else if(Input_Selected[key]==='TIME_STAMP'){
        if(Input_Checked[key]=="true")
          Input_Json.Property.TIME_STAMP[key] = Input_Checked[key];
    }else if(Input_Selected[key]==='FEATURE'){
        if(Input_Checked[key]=="true")
          Input_Json.Property.FEATURE[key] = Input_Checked[key];
    }else if(Input_Selected[key]==='LABEL'){
        if(Input_Checked[key]=="true")
          Input_Json.Property.LABEL[key] = Input_Checked[key];
    }
  })
  console.log(Input_Json);
  global.ipcRenderer.send('Input_Json',Input_Json)
 }
 



  const clickDir = event => {
    const {path, name} = event.target.files[0];
    console.log(path);
    console.log(name);
    const select_file = event.target.files[0].path;
    console.log(select_file);
    //const dir = path.replace(name, '');
   // console.log(dir);
    //setValue('target_directory', dir);
    //setInputText(dir);
    // const {path, name, webkitRelativePath} = event.target.files[0];

    // const parentDir = path.replace(webkitRelativePath, '');
    // // const currentDir = parentDir + webkitRelativePath.split('/')[0] + '/';
    // const currentDir = parentDir + webkitRelativePath.split('\\')[0] + '\\';

    // setValue('target_directory', currentDir);
    // setInputText(currentDir);
    setFileCount(event.target.files.length);
    setfilepath(select_file);
    console.log(filepath);
    readExcel(event)
    setFile(event.target.files[0]);

  };

  /**const setFilePath = event => {
    setInputText(event.target.value);
    setValue('target_directory', event.target.value);
  };**/

  return (
    
    <ul role="list" className=" block space-y-3 ">
    
      <p className=" block text-sm font-medium text-gray-700">
        2. {title} {fileCount ? `(Total ${fileCount} files)` : null}
      </p>
     <div className="flex mt-1">
       {/*  <label className="hidden inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-red-900 font-bold  text-sm focus:ring-indigo-500 focus:border-indigo-500">
          경로선택
          <input onChange={clickDir} ref={ref} type={"file"} className="hidden"/>

  </label>*/}
        <label className="inline-block items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-blue-900 font-bold  text-sm focus:ring-indigo-500 focus:border-indigo-500 hover:bg-gray-300">
          경로선택
          <input onChange={clickDir } type={"file"} className="hidden"accept=".csv,.xlsx"/>

        </label>
        
        <input
          value={filepath}
          type="text"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
        />
        
      </div>
      <div>
<p className="  py-2 block text-sm font-medium text-gray-700">
              {filepath}
               </p>
        <label className="col-span-6 inline font-bold text-sm border border-r-1  ">
        
{file_list.map((menu, index) => (
<div id={`${menu}`} onDragOver ={Delete_Button} className='px-3 py-2 shadow-inner  rounded-l-md border-gray-300 border border-r-1 bg-gray-100 hover:bg-gray-300 ' >
<label  >

</label>
<div className='item-center'>{index+1+"."}  {menu}</div>

  <div>Mandatory<input onChange={Click_Check} className='shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 sm:order-1 sm:ml-3' type={"checkbox"} id={`${menu}`}></input>
<select  onChange={Click_Select} name="Sel_op" id={`${index}`} className=' sm:text-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 sm:order-1 sm:ml-3'>
			<option  value="INFO">INFO</option>
			<option  value="TIME_STAMP">TIME_STAMP</option>
			<option  value="FEATURE">FEATURE</option>
      <option  value="LABEL">LABEL</option>
		</select>
</div>   
  
  
   
    </div>))}
</label></div>
  
  <div className=''></div> 
 

  <label className="col-span-6 block inline font-bold text-sm ">


         
             <p className="block text-sm font-medium text-gray-700">
               3. 알고리즘 선택
               </p>
 
{SelectAlgorithm.map((menu, index) => (
<div className='px-3 py-2 shadow-inner flex flex-col  rounded-l-md gray-400 border border-r-1 bg-gray-100 hover:bg-gray-300 ' >
<div className='block '> 
  {index+1+"."} {menu} 
  <input onChange={Click_Algorithm} className='shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 sm:order-1 sm:ml-3' type={"checkbox"} id={`${index}`}></input>
   </div>
  
    <br />
    </div>))}
 </label>
 <div className='col-span-6 flex justify-end my-4'> 
   <label className='col-span-6 order-0 w-28 text-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3' 
 onClick={Create_Json} >제출</label>
 </div>

   </ul>

  );
  
};

export default DataSetPathSelectButton_ex;
