package com.example.matchmovie.viewmodels;

import android.graphics.Movie;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.matchmovie.models.MovieModel;
import com.example.matchmovie.repositories.MovieRepository;

import java.lang.invoke.MutableCallSite;
import java.util.List;

public class MovieListViewModel extends ViewModel {
    //classe usada para o VIEWMODEL

    private MovieRepository movieRepository;

    //Constructor
    public MovieListViewModel() {
        movieRepository = MovieRepository.getInstance();
    }

    public LiveData<List<MovieModel>> getMovies(){
        return movieRepository.getMovies();
    }
    public LiveData<List<MovieModel>> getPop(){
        return movieRepository.getPop();
    }
    public LiveData<List<MovieModel>> getNowPlaying(){
        return movieRepository.getNowPlaying();
    }
    public LiveData<List<MovieModel>> getTopRated(){
        return movieRepository.getTopRated();
    }
    public LiveData<List<MovieModel>> getUpcoming(){
        return movieRepository.getUpcoming();
    }

    //3- chamando o método no view-model
    public void searchMovieApi(String query, int pageNumber){
        movieRepository.searchMovieApi(query, pageNumber);
    }
    public void searchMoviePop(int pageNumber){
        movieRepository.searchMoviePop(pageNumber);
    }
    public void searchMovieNowPlaying(int pageNumber){
        movieRepository.searchMovieNowPlaying(pageNumber);
    }
    public void searchMovieTopRated(int pageNumber){
        movieRepository.searchMovieTopRated(pageNumber);
    }
    public void searchMovieUpcoming(int pageNumber){
        movieRepository.searchMovieUpcoming(pageNumber);
    }

    public void searchNextPage(){
        movieRepository.searchNextPage();
    }
}
