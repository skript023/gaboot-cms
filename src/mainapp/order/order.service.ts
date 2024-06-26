import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseSuccess } from 'src/services/general/interfaces/response.dto';
import { Request } from 'express';
import { Op } from 'sequelize';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from '../master/products/entities/product.entity';
import { ProductImage } from '../master/products/entities/product.image.entity';
import { Customer } from '../master/customers/entities/customer.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        @InjectModel(OrderDetail) private orderDetailModel: typeof OrderDetail,
        private response: ResponseSuccess<Order>,
        private responseDetail: ResponseSuccess<OrderDetail>
    ) {}

    

    async create(createOrderDto: CreateOrderDto) {
        return `This is unused`;
    }

    async findAll(req: Request) {
        const page = req.query.page == null ? 0 : Number(req.query.page) - 1;
        const limit = req.query.limit == null ? 10 : Number(req.query.limit);

        const filterData: any = {};
        if (req.query.name != undefined && req.query.name != '')
            filterData.name = {
                [Op.like]: `%${req.query.name}%`,
            };

        const orders = await this.orderModel.findAll({
            limit: limit,
            offset: page * limit,
            where: filterData,
            include: [
                Customer
            ]
        });

        if (orders.length == 0) {
            this.response.message = 'No Data Found';
            this.response.success = false;

            return this.response.toJson();
        }

        this.response.message = 'Success Get Orders';
        this.response.success = true;
        this.response.data = orders;

        return this.response.toJson();
    }

    async findOne(id: string) {
        const order = await this.orderModel.findOne({
            where: { id: id },
            include: [
                {
                    model: OrderDetail,
                    required: false
                }
            ]
        });

        if (order == null) {
            throw new NotFoundException('Data Not Found');
        }

        console.log(this.response);

        this.response.message = 'Success Get Order';
        this.response.success = true;
        this.response.datum = order;

        return this.response.toJson();
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const dataUpdate: any = updateOrderDto;

        await this.orderModel.update(dataUpdate, { where: { id: id } });
        const menu = await this.orderModel.findOne({ where: { id: id } });

        this.response.message = 'Success Update Category Data';
        this.response.success = true;
        this.response.datum = menu;

        return this.response.toJson();
    }

    async remove(id: string) {
        return `This action removes a #${id} order`;
    }

    /* ====================== ORDER DETAILS ====================== */
    async findAllDetail(req: Request) {
        const page = req.query.page == null ? 0 : Number(req.query.page) - 1;
        const limit = req.query.limit == null ? 10 : Number(req.query.limit);

        const filterData: any = {};
        if (req.query.name != undefined && req.query.name != '')
            filterData.name = {
                [Op.like]: `%${req.query.name}%`,
            };

        const ordDetails = await this.orderDetailModel.findAll({
            limit: limit,
            offset: page * limit,
            where: filterData,
        });

        if (ordDetails.length == 0) {
            this.responseDetail.message = "No Data Found";
            this.responseDetail.success = false;

            return this.responseDetail.toJson();
        }

        this.responseDetail.message = 'Success Get Order Detail';
        this.responseDetail.success = true;
        this.responseDetail.data = ordDetails;

        return this.responseDetail.toJson();
    }

    async findOneDetail(id: string) {
        const ordDetails = await this.orderDetailModel.findOne({
            where: { id: id },
            include: [
                {
                    model: Product,
                    required: true,
                    include: [ProductImage]
                }
            ]
        });

        if (ordDetails == null) {
            throw new NotFoundException('Data Not Found');
        }

        this.responseDetail.message = 'Success Get Order Detail';
        this.responseDetail.success = true;
        this.responseDetail.datum = ordDetails;

        return this.responseDetail.toJson();
    }
}
