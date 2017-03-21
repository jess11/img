Rails.application.routes.draw do
  root :to => 'pages#index'
  get '/start' => 'pages#start'
  get '/gallery' => 'pages#gallery'
  resources :users, :only => [:new,:create]
  get '/login' => 'session#new'
  post '/login' => 'session#create'
  delete '/login' => 'session#destroy'
  resources :photos

end
