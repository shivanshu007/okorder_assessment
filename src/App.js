import React from 'react';
import logo from './logo.svg';
import './App.css';

const apiUrl = "https://hn.algolia.com/api/v1/search_by_date?tags=story&page="

async function postData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
  });
  return response.json();
}

class App extends React.Component {

  state = {
    data : [],
    articles: [], 
    currentPage: 0,
    scrollPageCount: 1,
    searchInput: '',
    isModal: false
  }

  async componentDidMount () {
      const d = await postData(apiUrl+this.state.currentPage);
      this.setState({articles: d.hits});

    const interval = setInterval( async ()=>{
      const page = this.state.currentPage+1;
      const d = await postData(apiUrl+page);
      this.setState({articles: [...this.state.articles,...d.hits], currentPage: page});
    }, 10000);


    const options = {
      root: null, 
      rootMargin: '0px',
      threshold: 0.5
    };
    const box = document.getElementById('lastMarker');
    let observer = new IntersectionObserver((entries)=>{ if (entries[0].intersectionRatio <= 0) {
      return;
    }; this.setState({scrollPageCount: this.state.scrollPageCount+1})}, options);
    observer.observe(box);



    // Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


  }

  searchInputHandler = ({target:{value}}) => {
    this.setState({searchInput: value});
  }


filterFunc = item=>{
  const {searchInput} = this.state;
  return  (item.title || "" ).toLowerCase().indexOf(searchInput)!=-1 || (item.url || "" ).toLowerCase().indexOf(searchInput)!=-1 || (item.author || "" ).toLowerCase().indexOf(searchInput)!=-1
}


  render () {
    const {data, articles, scrollPageCount, searchInput, selectedRowIndex, isModal } = this.state;
    return (
      <div className="App">
      <div><h3 > search:  </h3 ><input type="text" value={searchInput} onChange={this.searchInputHandler} placeholder="search by title, author or URL here" ></input></div>
       <table>
         <thead>
        <tr>
          <th>title</th>
          <th>URL</th>
          <th>created_at</th>
          <th>author</th>
        </tr>
        </thead>
        <tbody>
        {(( articles.slice(0, (10*scrollPageCount)-1 )) || [] ).filter(this.filterFunc).map( (article, index)=> {
          const {title, url, created_at, author} = article;
          return <tr onClick={()=>{
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            this.setState({isModal: true,selectedRowIndex: index})
            }}   key={title+this.state.currentPage}>
          <td>{title}</td>
          <td>{url}</td>
          <td>{(new Date(created_at)).toString()}</td>
          <td>{author}</td>
          </tr>
        })}
        </tbody>
       </table>
       <div id="lastMarker" style={{height: 10, backgroundColor: 'red'}}></div>
      {<div id="myModal" class="modal">
        <span className="close" >X</span>
    <div class="modal-content">
    {JSON.stringify(( articles.filter(this.filterFunc)[selectedRowIndex] ||{}))}
  </div>
</div>}



      </div>
    )
  }
}

// title, URL, created_at, and author

export default App;
