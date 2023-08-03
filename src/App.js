import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
        


function App() {
  const[countries, setCountries] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: globalFilterValue, matchMode: FilterMatchMode.STARTS_WITH }
});

  const fetchCountries = async()=>{
    const response = await fetch ('https://restcountries.com/v3.1/independent?status=true&fields=languages,capital,name,population,area,currencies,flags');
    const resData = await response.json();
    console.log(resData[100].currencies);
    // const formattedCountries = resData.map(country => {
    //   const currencyObj = {...country.currencies};
    //   const key = Object.keys(currencyObj)[0];
    //   return {
    //     ...country,
    //     currency:currencyObj[key]
    //   }
    // });
    setCountries(resData);
  }
  
  useEffect(()=>{
    fetchCountries();
  },[]);

  const imageBodyTemplate = (country) => {
    return <img src={country.flags.png} alt={'flag'} style={{width:40, borderRadius:2, height:30}}/>};


   const currencyBodyTemplate =(country)=>{
    let currency = '';
    let tooltip = '';
    for (let key in country.currencies){
      currency = key;
      tooltip = country.currencies[key].name
      break;
    }
    return <span title ={tooltip}>{currency}</span>
   } 

   const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    console.log('value:', value);
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};

  const renderHeader = () => {
    return (
        <div className="flex justify-content-end">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );
  };

  const header = renderHeader();


  return (
    <div>
      <Card style={{width:'80%', margin:'20px auto 0px', minHeight:'95vh', backgroundColor: '#fafafa', position: 'block'}}>

      <DataTable 
        header = {header}
        value={countries} 
        filters={filters}
        rowHover
        stripedRows 
        paginator rows={10}
        globalFilterFields={['name.common']}
        //tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="name.common" sortable header="Country" style={{ minWidth: '14rem' }}></Column>
        <Column field="capital" sortable header="Capital" style={{ minWidth: '14rem' }}></Column>
        <Column field="area" sortable header="Area" style={{ minWidth: '13rem' }}></Column>
        <Column field="population" sortable header="Population"style={{ minWidth: '13rem' }}></Column>
        <Column field="currencies" body={currencyBodyTemplate} header="Currency" style={{ minWidth: '7rem' }}></Column>
        <Column field ="flags" body={imageBodyTemplate} header="Flag" style={{ minWidth: '12rem' }}></Column>

      </DataTable>
      </Card>
    </div>
  );
}

export default App;
