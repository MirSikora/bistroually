const menu = document.getElementById('menu');

// Function for the actual number of week, which is use in url address for menu JSON file

function getNumberOfWeek(){

    const today = new Date();
    const year = new Date(today.getFullYear(),0,1);
    const days = Math.floor((today - year)/(24*60*60*1000));
    const week = Math.ceil((today.getDay() + 1 + days)/7);
    return week;

}

const buttons = createTag('div', menu, ['d-flex', 'flex-column', 'flex-sm-row', 'justify-content-center','mb-5', 'w-100','gap-sm-3', 'gap-md-5','ps-10']);
const toggleWeekMenu = createTag('button',buttons, ['mb-3','fs-2', 'me-md-2','me-lg-5', 'bg-warning', 'fw-bold', 'd-flex', 'flex-column', 'flex-sm-row', 'justify-content-center', 'align-items-center']);
const togglePermanentMenu = createTag('button',buttons, ['mb-3','fs-2', 'ms-md-2', 'ms-lg-5']);
createTag('span', toggleWeekMenu,['me-3']).textContent = 'Denní menu';
togglePermanentMenu.textContent = 'Jídelní lístek';
const weekMenu = createTag('div', menu);
const permanentMenu = createTag('div', menu,['d-none']);

getPermanentMenu()
getMenuItems();

togglePermanentMenu.addEventListener('click',()=>{

    weekMenu.classList.add('d-none');
    permanentMenu.classList.remove('d-none');
    toggleWeekMenu.classList.remove('bg-warning', 'fw-bold');
    togglePermanentMenu.classList.add('bg-warning', 'fw-bold');

})
toggleWeekMenu.addEventListener('click',()=>{
    
    permanentMenu.classList.add('d-none');
    weekMenu.classList.remove('d-none');
    toggleWeekMenu.classList.add('bg-warning', 'fw-bold');
    togglePermanentMenu.classList.remove('bg-warning', 'fw-bold');
})

async function getMenuItems(){
    
    //const path = './menu/week'+getNumberOfWeek()+'.json';
    const path = './menu/week43.json';    
    const response = await fetch(path);
    
    if(!response.ok){
        weekMenu.classList.add('d-flex','justify-content-center','align-items-center', 'mt-5'); 
        return weekMenu.textContent = 'Omlouváme se, ale denní menu zatím není k dispozici.';
    }
    
    const data = await response.json();    
    const values = [];
    values.push(...data);
    
    createTag('span', toggleWeekMenu).textContent = values[0]['day']+' - '+values[4]['day'];

    values.forEach((value)=>{

        createTag('h2', weekMenu, ['mt-5', 'ms-5']).textContent = value['dayOfWeek'] + ' ' + value['day'];

        if(value['event'] != 'normal'){

            createTag('p', weekMenu, ['ps-5']).textContent = value['event'];

        }else{

            getItems(value['soup'], weekMenu);
            getItems(value['menu1'], weekMenu);
            if(value['menu2']) getItems(value['menu2'], weekMenu);

        } 

    }) 
              
};

async function getPermanentMenu(){

    const response = await fetch('./menu/menu.json');
    const data = await response.json();
    const values = [];    
    values.push(...data);

    values.forEach((value)=>{

        createTag('h2', permanentMenu, ['mt-5', 'ms-5']).textContent = value['title'];
        
        value["items"].forEach((item)=>{
                
            getItems(item, permanentMenu);
        })

    })
    
}


function getItems(values, appendTag) {

    const p = createTag('p', appendTag, ['text-secondary']);
    p.textContent = values[0] + ' ';
    createTag('span', p, ['ms-2', 'text-dark']).textContent = values[1] + ' ';
    if(values[2]!='') createTag('span', p, ['ms-2', 'fs-6', 'text-danger']).textContent = '(A - ' + values[2] + ') ';
    createTag('span', p, ['ms-2']).textContent = values[3] + ' '; 

}

function createTag(newTag, appendTag, classes = []){

    const tag = document.createElement(newTag); 
    if(classes.length > 0){
        classes.forEach((item)=>{
            tag.classList.add(item);
        });  
    } 
          
    appendTag.appendChild(tag);
    return tag;

}

