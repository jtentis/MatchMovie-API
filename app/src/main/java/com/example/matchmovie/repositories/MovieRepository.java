package com.example.matchmovie.repositories;

import android.graphics.Movie;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.matchmovie.models.MovieModel;
import com.example.matchmovie.request.MovieApiClient;

import java.util.List;

public class MovieRepository {
    //essa classe é o repositório
    private static MovieRepository instance;

    private MovieApiClient movieApiClient;

    private String mQuery;
    private int mPageNumber;
    public static MovieRepository getInstance(){
        if(instance == null){
            instance = new MovieRepository();

        }
        return instance;
    }
    private MovieRepository(){
        movieApiClient = MovieApiClient.getInstance();
    }

    public LiveData<List<MovieModel>> getMovies(){
        return movieApiClient.getMovies();}
    public LiveData<List<MovieModel>> getPop(){
        return movieApiClient.getMoviesPop();
    }
    public LiveData<List<MovieModel>> getNowPlaying(){
        return movieApiClient.getMoviesNowPlaying();
    }
    public LiveData<List<MovieModel>> getTopRated(){
        return movieApiClient.getMoviesTopRated();
    }
    public LiveData<List<MovieModel>> getUpcoming(){
        return movieApiClient.getMoviesUpcoming();
    }

    //2- chamando o método do repositório
    public void searchMovieApi(String query, int pageNumber){
        mQuery = query;
        mPageNumber = pageNumber;
        movieApiClient.searchMoviesApi(query, pageNumber);
    }
    public void searchMoviePop(int pageNumber){
        mPageNumber = pageNumber;
        movieApiClient.searchMoviesApiPop(pageNumber);
    }
    public void searchMovieNowPlaying(int pageNumber){
        mPageNumber = pageNumber;
        movieApiClient.searchMoviesApiNowPlaying(pageNumber);
    }
    public void searchMovieTopRated(int pageNumber){
        mPageNumber = pageNumber;
        movieApiClient.searchMoviesApiTopRated(pageNumber);
    }
    public void searchMovieUpcoming(int pageNumber){
        mPageNumber = pageNumber;
        movieApiClient.searchMoviesApiUpcoming(pageNumber);
    }

    // scroll infinito
    // TODO: resolver bug do scroll infinito
    public void searchNextPage(){
        searchMovieApi(mQuery, mPageNumber+1);
//        searchMoviePop(mPageNumber+1);
        searchMovieTopRated(mPageNumber+1);
//        searchMovieNowPlaying(mPageNumber+1);
//        searchMovieUpcoming(mPageNumber+1);

    }
}




