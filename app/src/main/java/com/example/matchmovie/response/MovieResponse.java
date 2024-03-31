package com.example.matchmovie.response;

import com.example.matchmovie.models.MovieModel;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

//classe para 'search', apenas 1 resultado
public class MovieResponse {
    //movie object
    @SerializedName("results")
    @Expose
    private MovieModel movie;
    public MovieModel getMovie(){
        return movie;
    }

    @Override
    public String toString() {
        return "MovieResponse{" +
                "movie=" + movie +
                '}';
    }
}
