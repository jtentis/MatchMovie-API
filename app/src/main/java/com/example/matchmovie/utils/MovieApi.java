package com.example.matchmovie.utils;

import com.example.matchmovie.models.MovieModel;
import com.example.matchmovie.response.MovieSearchResponse;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface MovieApi {
    //procurando filme pelo nome
    @GET("/3/search/movie?&language=pt-BR")
    Call<MovieSearchResponse> searchMovie(
            @Query("api_key") String key,
            @Query("query") String query,
            @Query("page") int page
    );

    //mostrando filmes populares
    @GET("/3/movie/popular?language=pt-BR")
    Call<MovieSearchResponse> getPopular (
            @Query("api_key") String key,
            @Query("page") int page
    );

    //mostrando filmes que estão passando no cinema agora
    @GET("/3/movie/now_playing?language=pt-BR")
    Call<MovieSearchResponse> getNowPlaying (
            @Query("api_key") String key,
            @Query("page") int page
    );

    //filmes mais bem avaliados
    @GET("/3/movie/top_rated?language=pt-BR")
    Call<MovieSearchResponse> getTopRated (
            @Query("api_key") String key,
            @Query("page") int page
    );

    //filmes que ainda vão lançar
    @GET("/3/movie/upcoming?language=pt-BR")
    Call<MovieSearchResponse> getUpcoming (
            @Query("api_key") String key,
            @Query("page") int page
    );

    //procurando filme pelo id
    //https://api.themoviedb.org/3/movie/550?api_key=2017240ed8d4e61fbe9ed801fe5da25a

    @GET("/3/movie/{movie_id}?")
    Call<MovieModel> getMovie(
            @Path("movie_id") int movie_id,
            @Query("api_key") String api_key
    );
}
