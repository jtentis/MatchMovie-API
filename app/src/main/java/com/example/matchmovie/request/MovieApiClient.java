package com.example.matchmovie.request;

import android.graphics.Movie;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.matchmovie.AppExecutors;
import com.example.matchmovie.models.MovieModel;
import com.example.matchmovie.response.MovieSearchResponse;
import com.example.matchmovie.utils.Credentials;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import retrofit2.Call;
import retrofit2.Response;

public class MovieApiClient {
    //para search view
    private MutableLiveData<List<MovieModel>> mMovies;
    private static MovieApiClient instance;
    private RetrieveMoviesRunnable retrieveMoviesRunnable;

    // para filmes populares
    private MutableLiveData<List<MovieModel>> mMoviesPop;
    private RetrieveMoviesRunnablePop retrieveMoviesRunnablePop;

    // para filmes passando agora
    private MutableLiveData<List<MovieModel>> mMoviesNowPlaying;
    private RetrieveMoviesRunnableNowPlaying retrieveMoviesRunnableNowPlaying;

    // para filmes mais bem avaliados
    private MutableLiveData<List<MovieModel>> mMoviesTopRated;
    private RetrieveMoviesRunnableTopRated retrieveMoviesRunnableTopRated;

    // para filmes que ainda vão estrear
    private MutableLiveData<List<MovieModel>> mMoviesUpcoming;
    private RetrieveMoviesRunnableUpcoming retrieveMoviesRunnableUpcoming;

    public static MovieApiClient getInstance(){
        if(instance == null){
            instance = new MovieApiClient();
        }
        return instance;
    }
    private MovieApiClient(){
        mMovies = new MutableLiveData<>();
        mMoviesPop = new MutableLiveData<>();
        mMoviesNowPlaying = new MutableLiveData<>();
        mMoviesTopRated = new MutableLiveData<>();
        mMoviesUpcoming = new MutableLiveData<>();
    }
    public LiveData<List<MovieModel>> getMovies(){
        return mMovies;
    }
    public LiveData<List<MovieModel>> getMoviesPop(){
        return mMoviesPop;
    }
    public LiveData<List<MovieModel>> getMoviesNowPlaying(){
        return mMoviesNowPlaying;
    }
    public LiveData<List<MovieModel>> getMoviesTopRated(){
        return mMoviesTopRated;
    }
    public LiveData<List<MovieModel>> getMoviesUpcoming(){
        return mMoviesUpcoming;
    }

    //1- usaremos esse método para chamar entre as classes
    public void searchMoviesApi(String query, int pageNumber){
        if(retrieveMoviesRunnable != null){
            retrieveMoviesRunnable = null;
        }

        retrieveMoviesRunnable = new RetrieveMoviesRunnable(query, pageNumber);

        final Future myHandler = AppExecutors.getInstance().networkIO().submit(retrieveMoviesRunnable);

        AppExecutors.getInstance().networkIO().schedule(new Runnable() {
            @Override
            public void run() {
                //Cancelando a chamada do retrofit
                myHandler.cancel(true);
            }
        }, 3000, TimeUnit.MILLISECONDS);
    }
    public void searchMoviesApiPop(int pageNumber){
        if(retrieveMoviesRunnablePop != null){
            retrieveMoviesRunnablePop = null;
        }

        retrieveMoviesRunnablePop = new RetrieveMoviesRunnablePop(pageNumber);

        final Future myHandler2 = AppExecutors.getInstance().networkIO().submit(retrieveMoviesRunnablePop);

        AppExecutors.getInstance().networkIO().schedule(new Runnable() {
            @Override
            public void run() {
                //Cancelando a chamada do retrofit
                myHandler2.cancel(true);
            }
        }, 1000, TimeUnit.MILLISECONDS);
    }
    public void searchMoviesApiNowPlaying(int pageNumber){
        if(retrieveMoviesRunnableNowPlaying != null){
            retrieveMoviesRunnableNowPlaying = null;
        }

        retrieveMoviesRunnableNowPlaying = new RetrieveMoviesRunnableNowPlaying(pageNumber);

        final Future myHandler3 = AppExecutors.getInstance().networkIO().submit(retrieveMoviesRunnableNowPlaying);

        AppExecutors.getInstance().networkIO().schedule(new Runnable() {
            @Override
            public void run() {
                //Cancelando a chamada do retrofit
                myHandler3.cancel(true);
            }
        }, 5000, TimeUnit.MILLISECONDS);
    }
    public void searchMoviesApiTopRated(int pageNumber){
        if(retrieveMoviesRunnableTopRated != null){
            retrieveMoviesRunnableTopRated = null;
        }

        retrieveMoviesRunnableTopRated = new RetrieveMoviesRunnableTopRated(pageNumber);

        final Future myHandler4 = AppExecutors.getInstance().networkIO().submit(retrieveMoviesRunnableTopRated);

        AppExecutors.getInstance().networkIO().schedule(new Runnable() {
            @Override
            public void run() {
                //Cancelando a chamada do retrofit
                myHandler4.cancel(true);
            }
        }, 5000, TimeUnit.MILLISECONDS);
    }
    public void searchMoviesApiUpcoming(int pageNumber){
        if(retrieveMoviesRunnableUpcoming != null){
            retrieveMoviesRunnableUpcoming = null;
        }

        retrieveMoviesRunnableUpcoming = new RetrieveMoviesRunnableUpcoming(pageNumber);

        final Future myHandler5 = AppExecutors.getInstance().networkIO().submit(retrieveMoviesRunnableUpcoming);

        AppExecutors.getInstance().networkIO().schedule(new Runnable() {
            @Override
            public void run() {
                //Cancelando a chamada do retrofit
                myHandler5.cancel(true);
            }
        }, 5000, TimeUnit.MILLISECONDS);
    }

    //temos 2 tipos de busca por query: por ID e por nome
    private class RetrieveMoviesRunnable implements Runnable{

        private String query;
        private int pageNumber;
        boolean cancelRequest;

        public RetrieveMoviesRunnable(String query, int pageNumber) {
            this.query = query;
            this.pageNumber = pageNumber;
            cancelRequest=false;
        }

        @Override
        public void run() {
            try{
                Response response = getMovies(query, pageNumber).execute();
                if (cancelRequest) {
                    return;
                }
                if(response.code()==200){
                    List<MovieModel> list = new ArrayList<>(((MovieSearchResponse)response.body()).getMovies());
                    if(pageNumber == 1){
                        //mandando dados para o live data
                        mMovies.postValue(list);
                    }else{
                        List<MovieModel> currentMovies = mMovies.getValue();
                        currentMovies.addAll(list);
                        mMovies.postValue(currentMovies);
                        }
                    }else{
                    String error = response.errorBody().string();
                    Log.v("tag", "Erro!"+error);
                    mMovies.postValue(null);
                }


            } catch (IOException e) {
                e.printStackTrace();
                mMovies.postValue(null);
            }
        }
            private Call<MovieSearchResponse> getMovies(String query, int pageNumber){
                return Servicey.getMovieApi().searchMovie(
                        Credentials.API_KEY,
                        query,
                        pageNumber
                );
            }
        private void cancelRequest(){
            Log.v("tag", "Cancelado request!");
            cancelRequest=true;
        }
    }
    private class RetrieveMoviesRunnablePop implements Runnable{

        private int pageNumber;
        boolean cancelRequest;

        public RetrieveMoviesRunnablePop(int pageNumber) {
            this.pageNumber = pageNumber;
            cancelRequest=false;
        }

        @Override
        public void run() {
            try{
                Response response2 = getPop(pageNumber).execute();
                if (cancelRequest) {
                    return;
                }
                if(response2.code()==200){
                    List<MovieModel> list = new ArrayList<>(((MovieSearchResponse)response2.body()).getMovies());
                    if(pageNumber == 1){
                        //mandando dados para o live data
                        mMoviesPop.postValue(list);
                    }else{
                        List<MovieModel> currentMovies = mMoviesPop.getValue();
                        currentMovies.addAll(list);
                        mMoviesPop.postValue(currentMovies);
                    }
                }else{
                    String error = response2.errorBody().string();
                    Log.v("tag", "Erro!"+error);
                    mMoviesPop.postValue(null);
                }


            } catch (IOException e) {
                e.printStackTrace();
                mMoviesPop.postValue(null);
            }
        }
        private Call<MovieSearchResponse> getPop(int pageNumber){
            return Servicey.getMovieApi().getPopular(
                    Credentials.API_KEY,
                    pageNumber
            );
        }
        private void cancelRequest(){
            Log.v("tag", "Request cancelada!");
            cancelRequest=true;
        }
    }
    private class RetrieveMoviesRunnableNowPlaying implements Runnable{

        private int pageNumber;
        boolean cancelRequest;

        public RetrieveMoviesRunnableNowPlaying(int pageNumber) {
            this.pageNumber = pageNumber;
            cancelRequest=false;
        }

        @Override
        public void run() {
            try{
                Response response3 = getNowPlaying(pageNumber).execute();
                if (cancelRequest) {
                    return;
                }
                if(response3.code()==200){
                    List<MovieModel> list = new ArrayList<>(((MovieSearchResponse)response3.body()).getMovies());
                    if(pageNumber == 1){
                        //mandando dados para o live data
                        mMoviesNowPlaying.postValue(list);
                    }else{
                        List<MovieModel> currentMovies = mMoviesNowPlaying.getValue();
                        currentMovies.addAll(list);
                        mMoviesNowPlaying.postValue(currentMovies);
                    }
                }else{
                    String error = response3.errorBody().string();
                    Log.v("tag", "Erro!"+error);
                    mMoviesNowPlaying.postValue(null);
                }


            } catch (IOException e) {
                e.printStackTrace();
                mMoviesNowPlaying.postValue(null);
            }
        }
        private Call<MovieSearchResponse> getNowPlaying(int pageNumber){
            return Servicey.getMovieApi().getNowPlaying(
                    Credentials.API_KEY,
                    pageNumber
            );
        }
        private void cancelRequest(){
            Log.v("tag", "Request cancelada!");
            cancelRequest=true;
        }
    }
    private class RetrieveMoviesRunnableTopRated implements Runnable{

        private int pageNumber;
        boolean cancelRequest;

        public RetrieveMoviesRunnableTopRated(int pageNumber) {
            this.pageNumber = pageNumber;
            cancelRequest=false;
        }

        @Override
        public void run() {
            try{
                Response response4 = getTopRated(pageNumber).execute();
                if (cancelRequest) {
                    return;
                }
                if(response4.code()==200){
                    List<MovieModel> list = new ArrayList<>(((MovieSearchResponse)response4.body()).getMovies());
                    if(pageNumber == 1){
                        //mandando dados para o live data
                        mMoviesTopRated.postValue(list);
                    }else{
                        List<MovieModel> currentMovies = mMoviesTopRated.getValue();
                        currentMovies.addAll(list);
                        mMoviesTopRated.postValue(currentMovies);
                    }
                }else{
                    String error = response4.errorBody().string();
                    Log.v("tag", "Erro!"+error);
                    mMoviesTopRated.postValue(null);
                }


            } catch (IOException e) {
                e.printStackTrace();
                mMoviesTopRated.postValue(null);
            }
        }
        private Call<MovieSearchResponse> getTopRated(int pageNumber){
            return Servicey.getMovieApi().getTopRated(
                    Credentials.API_KEY,
                    pageNumber
            );
        }
        private void cancelRequest(){
            Log.v("tag", "Request cancelada!");
            cancelRequest=true;
        }
    }
    private class RetrieveMoviesRunnableUpcoming implements Runnable{

        private int pageNumber;
        boolean cancelRequest;

        public RetrieveMoviesRunnableUpcoming(int pageNumber) {
            this.pageNumber = pageNumber;
            cancelRequest=false;
        }

        @Override
        public void run() {
            try{
                Response response5 = getUpcoming(pageNumber).execute();
                if (cancelRequest) {
                    return;
                }
                if(response5.code()==200){
                    List<MovieModel> list = new ArrayList<>(((MovieSearchResponse)response5.body()).getMovies());
                    if(pageNumber == 1){
                        //mandando dados para o live data
                        mMoviesUpcoming.postValue(list);
                    }else{
                        List<MovieModel> currentMovies = mMoviesUpcoming.getValue();
                        currentMovies.addAll(list);
                        mMoviesUpcoming.postValue(currentMovies);
                    }
                }else{
                    String error = response5.errorBody().string();
                    Log.v("tag", "Erro!"+error);
                    mMoviesUpcoming.postValue(null);
                }


            } catch (IOException e) {
                e.printStackTrace();
                mMoviesUpcoming.postValue(null);
            }
        }
        private Call<MovieSearchResponse> getUpcoming(int pageNumber){
            return Servicey.getMovieApi().getUpcoming(
                    Credentials.API_KEY,
                    pageNumber
            );
        }
        private void cancelRequest(){
            Log.v("tag", "Request cancelada!");
            cancelRequest=true;
        }
    }
}

