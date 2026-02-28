import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MapView from "@/views/MapView.vue";
import PropertyDetailView from "@/views/PropertyDetailView.vue";
import AboutView from "@/views/AboutView.vue";
import OfferView from "@/views/OfferView.vue";
import ContactView from "@/views/ContactView.vue";
import BlogView from "@/views/BlogView.vue";
import BlogPostView from "@/views/BlogPostView.vue";
import OrderStatusView from "@/views/OrderStatusView.vue";
import NotFoundView from "@/views/NotFoundView.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/map',
            name: 'map',
            component: MapView
        },
        {
            path: '/order-status',
            name: 'order-status',
            component: OrderStatusView
        },
        {
            path: '/about',
            name: 'about',
            component: AboutView
        },
        {
            path: '/properties',
            name: 'properties',
            component: OfferView
        },
        {
            path: '/properties/:id',
            name: 'property-detail',
            component: PropertyDetailView
        },
        {
            path: '/blog',
            name: 'blog',
            component: BlogView
        },
        {
            path: '/blog/:id',
            name: 'blog-post',
            component: BlogPostView
        },
        {
            path: '/contact',
            name: 'contact',
            component: ContactView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        },
    ]
})

export default router;