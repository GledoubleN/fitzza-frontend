import { api } from '../api/axios.js'
import { http, HttpResponse } from 'msw/http'
import getUsersPreferencesFitsResponse from '../data/responses/get-users-preferences-fits.json'
import getUsersPreferencesStylesResponse from '../data/responses/get-users-preferences-styles.json'
import getUsersMeResponse from '../data/responses/get-users-me.json'
import patchUsersMeResponse from '../data/responses/patch-users-me.json'
import postAuthSigninResponse from '../data/responses/post-auth-signin.json'
import postAuthRefreshResponse from '../data/responses/post-auth-refresh.json'
import postAuthSignupResponse from '../data/responses/post-auth-signup.json'
import postAuthSignoutResponse from '../data/responses/post-auth-signout.json'
import getUersIdResponse from '../data/responses/get-uers-id.json'
import getCategoriesResponse from '../data/responses/get-categories.json'
import getProductsResponse from '../data/responses/get-products.json'
import getProductsIdResponse from '../data/responses/get-products-id.json'
import getReviewsResponse from '../data/responses/get-reviews.json'
import getCartsResponse from '../data/responses/get-carts.json'
import postCartsResponse from '../data/responses/post-carts.json'
import patchCartsCartIdResponse from '../data/responses/patch-carts-cartId.json'
import postOrdersResponse from '../data/responses/post-orders.json'
import getOrdersResponse from '../data/responses/get-orders.json'
import getOrdersOrderIdResponse from '../data/responses/get-orders-orderId.json'
import getSurveysMeResponse from '../data/responses/get-surveys-me.json'
import postSurveysResponse from '../data/responses/post-surveys.json'
import getWishlistsResponse from '../data/responses/get-wishlists.json'
import postWishlistsResponse from '../data/responses/post-wishlists.json'
import getLikesResponse from '../data/responses/get-likes.json'
import postRecommendationsResponse from '../data/responses/post-recommendations.json'
import getRecommendationsResponse from '../data/responses/get-recommendations.json'
import getRecommendationsRequestIdResponse from '../data/responses/get-recommendations-requestId.json'
import getNotificationsResponse from '../data/responses/get-notifications.json'
import postWorldcupsResponse from '../data/responses/post-worldcups.json'
import getWorldcupsHistoryResponse from '../data/responses/get-worldcups-history.json'
import postVtonResponse from '../data/responses/post-vton.json'
import getVtonResponse from '../data/responses/get-vton.json'
import getVtonFittingIdResponse from '../data/responses/get-vton-fittingId.json'
import getCommunityPostsResponse from '../data/responses/get-community-posts.json'
import postCommunityPostsResponse from '../data/responses/post-community-posts.json'
import getCommunityPostsPostIdResponse from '../data/responses/get-community-posts-postId.json'
import postCommunityPostsPostIdLikesResponse from '../data/responses/post-community-posts-postId-likes.json'
import deleteCommunityPostsPostIdLikesResponse from '../data/responses/delete-community-posts-postId-likes.json'
import getCommunityPostsPostIdPollResponse from '../data/responses/get-community-posts-postId-poll.json'
import postCommunityPostsPostIdPollVotesResponse from '../data/responses/post-community-posts-postId-poll-votes.json'
import patchCommunityPostsPostIdPollResponse from '../data/responses/patch-community-posts-postId-poll.json'
import getCommunityPostsPostIdCommentsResponse from '../data/responses/get-community-posts-postId-comments.json'
import postCommunityPostsPostIdCommentsResponse from '../data/responses/post-community-posts-postId-comments.json'
import postCommentsCommentIdLikesResponse from '../data/responses/post-comments-commentId-likes.json'
import deleteCommentsCommentIdLikesResponse from '../data/responses/delete-comments-commentId-likes.json'

export const handlers = [
  http.get(
    `${ api.defaults.baseURL }/users/preferences/fits`,
    () => HttpResponse.json(getUsersPreferencesFitsResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/users/preferences/styles`,
    () => HttpResponse.json(getUsersPreferencesStylesResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/users/me`,
    () => HttpResponse.json(getUsersMeResponse),
  ),

  http.patch(
    `${ api.defaults.baseURL }/users/me`,
    () => HttpResponse.json(patchUsersMeResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/signin`,
    () => HttpResponse.json(postAuthSigninResponse, {
      headers: {
        'Set-Cookie': 'refreshToken=fitzza-refresh-token; Path=/; SameSite=Lax',
      },
    }),
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/refresh`,
    () => HttpResponse.json(postAuthRefreshResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/signup`,
    () => HttpResponse.json(postAuthSignupResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/signout`,
    () => HttpResponse.json(postAuthSignoutResponse, {
      headers: {
        'Set-Cookie': 'refreshToken=; Path=/; SameSite=Lax; Max-Age=0',
      },
    }),
  ),

  http.get(
    `${ api.defaults.baseURL }/uers/:id`,
    () => HttpResponse.json(getUersIdResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/categories`,
    () => HttpResponse.json(getCategoriesResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/products`,
    () => HttpResponse.json(getProductsResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/products/:id`,
    () => HttpResponse.json(getProductsIdResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/reviews`,
    () => HttpResponse.json(getReviewsResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/carts`,
    () => HttpResponse.json(getCartsResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/carts`,
    () => HttpResponse.json(postCartsResponse, { status: 201 }),
  ),

  http.patch(
    `${ api.defaults.baseURL }/carts/:cartId`,
    () => HttpResponse.json(patchCartsCartIdResponse),
  ),

  http.delete(
    `${ api.defaults.baseURL }/carts/:cartId`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.post(
    `${ api.defaults.baseURL }/orders`,
    () => HttpResponse.json(postOrdersResponse, { status: 201 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/orders`,
    () => HttpResponse.json(getOrdersResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/orders/:orderId`,
    () => HttpResponse.json(getOrdersOrderIdResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/surveys/me`,
    () => HttpResponse.json(getSurveysMeResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/surveys`,
    () => HttpResponse.json(postSurveysResponse, { status: 201 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/wishlists`,
    () => HttpResponse.json(getWishlistsResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/wishlists`,
    () => HttpResponse.json(postWishlistsResponse),
  ),

  http.delete(
    `${ api.defaults.baseURL }/wishlists`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/likes`,
    () => HttpResponse.json(getLikesResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/recommendations`,
    () => HttpResponse.json(postRecommendationsResponse, { status: 202 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations`,
    () => HttpResponse.json(getRecommendationsResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations/personalized`,
    () => HttpResponse.json(getProductsResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations/:requestId`,
    () => HttpResponse.json(getRecommendationsRequestIdResponse),
  ),

  http.delete(
    `${ api.defaults.baseURL }/recommendation/:requestId`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/notifications`,
    () => HttpResponse.json(getNotificationsResponse),
  ),

  http.patch(
    `${ api.defaults.baseURL }/notifications/:notificationId`,
    () => new HttpResponse(null, { status: 200 }),
  ),

  http.post(
    `${ api.defaults.baseURL }/worldcups`,
    () => HttpResponse.json(postWorldcupsResponse, { status: 201 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/worldcups/history`,
    () => HttpResponse.json(getWorldcupsHistoryResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/vton`,
    () => HttpResponse.json(postVtonResponse, { status: 202 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/vton`,
    ({ request }) => {
      const requestId = new URL(request.url).searchParams.get('requestId')
      if (!requestId) return HttpResponse.json(getVtonResponse)

      const items = getVtonResponse.items.filter((fitting) => fitting.requestId === Number(requestId))
      return HttpResponse.json({ ...getVtonResponse, items, totalCount: items.length })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/vton/:fittingId`,
    ({ params }) => {
      const fitting = getVtonResponse.items.find((fitting) => fitting.fittingId === Number(params.fittingId))
      return HttpResponse.json(fitting ?? getVtonFittingIdResponse)
    },
  ),

  http.delete(
    `${ api.defaults.baseURL }/vton/:fittingId`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/community/posts`,
    () => HttpResponse.json(getCommunityPostsResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/community/posts`,
    () => HttpResponse.json(postCommunityPostsResponse, { status: 201 }),
  ),

  http.get(
    `${ api.defaults.baseURL }/community/posts/:postId`,
    () => HttpResponse.json(getCommunityPostsPostIdResponse),
  ),

  http.patch(
    `${ api.defaults.baseURL }/community/posts/:postId`,
    () => new HttpResponse(null, { status: 200 }),
  ),

  http.delete(
    `${ api.defaults.baseURL }/community/posts/:postId`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.post(
    `${ api.defaults.baseURL }/community/posts/:postId/likes`,
    () => HttpResponse.json(postCommunityPostsPostIdLikesResponse),
  ),

  http.delete(
    `${ api.defaults.baseURL }/community/posts/:postId/likes`,
    () => HttpResponse.json(deleteCommunityPostsPostIdLikesResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/community/posts/:postId/poll`,
    () => HttpResponse.json(getCommunityPostsPostIdPollResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/community/posts/:postId/poll/votes`,
    () => HttpResponse.json(postCommunityPostsPostIdPollVotesResponse),
  ),

  http.patch(
    `${ api.defaults.baseURL }/community/posts/:postId/poll`,
    () => HttpResponse.json(patchCommunityPostsPostIdPollResponse),
  ),

  http.get(
    `${ api.defaults.baseURL }/community/posts/:postId/comments`,
    () => HttpResponse.json(getCommunityPostsPostIdCommentsResponse),
  ),

  http.post(
    `${ api.defaults.baseURL }/community/posts/:postId/comments`,
    () => HttpResponse.json(postCommunityPostsPostIdCommentsResponse, { status: 201 }),
  ),

  http.patch(
    `${ api.defaults.baseURL }/comments/:commentId`,
    () => new HttpResponse(null, { status: 200 }),
  ),

  http.delete(
    `${ api.defaults.baseURL }/comments/:commentId`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.post(
    `${ api.defaults.baseURL }/comments/:commentId/likes`,
    () => HttpResponse.json(postCommentsCommentIdLikesResponse),
  ),

  http.delete(
    `${ api.defaults.baseURL }/comments/:commentId/likes`,
    () => HttpResponse.json(deleteCommentsCommentIdLikesResponse),
  ),
]