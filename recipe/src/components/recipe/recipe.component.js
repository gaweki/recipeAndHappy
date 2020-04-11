import React, { Component } from "react"; 
import styles from './recipe.module.sass';

import axios from 'axios';

class Recipe extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      keywordI: "",
      keywordQ: "",
      arrDatas: [],
      currentPage: 1,
      isLoading: true,
      currentQuery: `&i=&q=`,
      currentOnlineStatus: true,
      showSearchQueryText: false
    }; 
 
    this.handleChangeSearchByIngredients = this.handleChangeSearchByIngredients.bind(this);
    this.handleChangeSearchByTitle = this.handleChangeSearchByTitle.bind(this);
    this.getData = this.getData.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);

  }

  async getData () {
    const { currentPage, currentQuery } = this.state 
    this.setState({
      isLoading: true
    })
    try{
      const res = await axios({
        method: 'get',
        url: `https://recipe-puppy.p.rapidapi.com/?p=${currentPage}${currentQuery}`, 
        headers: {
          "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
          "x-rapidapi-key": "6a19060e2dmshd15116b37bc243bp156c02jsn9b96d9e9e147"
        }
      })
      this.setState( prevState => { 
        if(currentPage === 1){
          return { 
             arrDatas: res.data.results
          }
        }
        return { 
          arrDatas: prevState.arrDatas.concat(res.data.results)
        }
      })
    } catch (error){
      console.log(error)
    }
    this.setState({
      isLoading: false
    })
    
  }

  getScrollPosition() {
    let self = this
    window.addEventListener('scroll', function() {
      const { arrDatas, currentOnlineStatus, isLoading } = self.state

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && arrDatas.length && currentOnlineStatus && !isLoading) {
        self.setState( prevState =>  {
          return {
          currentPage: prevState.currentPage+1
          }
        }, () => self.getData())
      }
   });
  }

  componentDidUpdate(prevProps) {
    const { onlineStatus } = this.props
    if(prevProps.onlineStatus !== onlineStatus){
      this.setState({
        currentOnlineStatus: onlineStatus
      })
    }
  }

  componentDidMount(){
    this.getData()
    this.getScrollPosition()
  } 

  handleChangeSearchByTitle (event) {
    this.setState({
      keywordQ : event.target.value
    })
  }

  handleChangeSearchByIngredients (event) {
    this.setState({
      keywordI : event.target.value
    })
  }

  handleSearchClick () {
    const { keywordI, keywordQ, currentOnlineStatus } = this.state
    if(currentOnlineStatus){
      let currentQuery = `&i=${keywordI}&q=${keywordQ}`
      this.setState({
        currentPage: 1,
        currentQuery,
        showSearchQueryText: true
      }, () => this.getData())
    }
  }

  render() {
    const { arrDatas, keywordQ, keywordI, isLoading, currentOnlineStatus, showSearchQueryText, currentQuery } = this.state
    const recipeQuery = currentQuery.split('&q=')[1]
    return (
      <div className={styles.pageContainer}>  
        <div className={styles.headerContainer}>
          <div className={styles.headerSubontainer}>
            <img className={styles.pageLogo} src={`https://rapidapi-prod-apis.s3.amazonaws.com/c6/b915519a674259a34c0f127916ab44/9a3ff07c7104b2c7a1c6afa986002c6e.png`} />
            <div>
              <input className={styles.searchInput} value={keywordQ} placeholder="Find By Recipe" onChange={this.handleChangeSearchByTitle}/>
              <input className={styles.searchInput} value={keywordI} placeholder="Find By Ingredients" onChange={this.handleChangeSearchByIngredients}/>
              <button onClick={this.handleSearchClick} className={styles.buttonSearch}>Search</button>
            </div>
          </div>
        </div>
        {
          currentOnlineStatus && showSearchQueryText && recipeQuery ? 
            <div className={styles.containerSearchSubText}>
              <i className={styles.searchSubText}>Search result for recipe </i>"{recipeQuery}"
            </div>
          :
          ''
        }
        <ul className={styles.listContainer}>
        {
          currentOnlineStatus ?
          (   
            arrDatas.length ?
              (
                arrDatas.map( (val, index) => {
                  return <li key={index} className={styles.itemContainer}>
                    <a href={val.href} rel='noopener' target="_blank" className={styles.itemSubcontainer}>
                      <img src={val.thumbnail ? val.thumbnail : `https://cdn.dribbble.com/users/1012566/screenshots/4187820/topic-2.jpg`} className={styles.itemImage} alt={val.title} />
                      <div>
                        <p className={styles.recipeTitleText}>{val.title}</p>
                        <p className={styles.ingredientsText}>Ingredients: {val.ingredients}</p>
                      </div>
                    </a>
                  </li>
                })
              )
              :
              (
                isLoading ?
                  ''
                  :
                  <div className={styles.emptyContainer}>Sorry, your search did not exist</div>
              )
          )
          :
          (
            <div className={styles.offlineContainer}>You're Offline </div>
          )

        }
        {
          currentOnlineStatus ?
            isLoading ?
              <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
              </div>
              :
              ''
            :
            ''
        }
        </ul>
        
      </div>
    );
  }
}

export default Recipe; 