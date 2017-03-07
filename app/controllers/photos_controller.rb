class PhotosController < ApplicationController


  def new
  end

  def create
    @photo = @current_user.photos.new photo_params
    if @photo.save
      render :json => []
    end

  end

  def destroy
    photo = Photo.find(params[:id])
    photo.destroy
    redirect_to :back
  end
end

private
def photo_params
    params.require(:photo).permit(:name, :user_id, :image)
end
