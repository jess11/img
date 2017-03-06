class UsersController < ApplicationController
  before_action :check_if_logged_in, :only =>[:edit, :update]

  def index
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new user_params
    if @user.save  #checking for validity
      session[:user_id] = @user.id #signing up also signs you in
      redirect_to gallery_path
    else
      render :new
    end
  end


  def edit
  end

  def update
  end

  private
  def user_params
    params.require(:user).permit(:name,:email,:password, :password_confirmation, :avatar)
  end

end
