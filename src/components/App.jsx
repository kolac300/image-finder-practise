import { fetchImages } from './Helper/Api';
import React, { Component } from 'react'
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Wrapper } from './App.styled';
import { Toaster, toast } from 'react-hot-toast';
import Loader from './Loader/Loader';
export default class App extends Component {
  state = {
    search: '',
    images: [],
    page: 1,
    modal: false,
    modalURL: '',
    isLoading: false
  }
  async componentDidUpdate(prevProp, prevState) {
    const { search, page } = this.state

    if (prevState.search !== search || prevState.page !== page) {
      try {
        this.setState({ isLoading: true })
        const images = await fetchImages(search, page)
        this.setState(prev => { return { images: [...prev.images, ...images] } })
      } catch (error) {
        toast.error("Nothing searched, Try again")
      } finally {
        this.setState({ isLoading: false })
      }
    }
  }

  updateSearch = (search) => {
    if (this.state.search === search) {
      toast.error("qweries are same")
    } else {
      this.setState({
        search: search,
        page: 1,
        images: []
      })
    }

  }
  updatePage = () => {

    this.setState(prev => {
      return { page: prev.page + 1 }
    })

  }
  toggleModal = (id, url) => {
    this.setState(prev => {
      return {
        modal: !prev.modal,
        modalURL: url
      }
    })
  }
  render() {

    return (
      // refactoting this
      <Wrapper>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Searchbar updateSearch={this.updateSearch} />
        <ImageGallery showModal={this.toggleModal} images={this.state.images} />
        {this.state.isLoading && <Loader />}
        {!!this.state.images.length &&
          <Button updatePage={this.updatePage} />}
        {this.state.modal &&
          <Modal toggleModal={this.toggleModal} modalURL={this.state.modalURL} />}
      </Wrapper>
    )
  }
}









