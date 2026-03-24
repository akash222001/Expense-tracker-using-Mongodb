const Expense = require('../models/expenses');
const Filesdownloaded = require('../models/filesdownloaded');
const User = require('../models/user');
const mongoose = require('mongoose');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const AWS = require('aws-sdk')




const downloadExpense = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id });

        // console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        // console.log(stringifiedExpenses);


        //filename should depend on the userid
        const userId = req.user._id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        await Filesdownloaded.create({ userid: userId, filesUrl: fileURL });

        // console.log(fileURL)
        res.status(200).json({ fileURL, success: true })
    }

    catch (error) {
        // console.log(error)
        res.status(500).json({ fileURL: '', success: false, error: error })
    }

}

function isstringnotvalid(string) {         //This function will return true if string not valid
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

function isintegernotvalid(int) {         //This function will return true if string not valid
    if (int == undefined || int.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

const addexpense = async (req, res) => {
    try {
        const { expenseamount, category, description } = req.body;

        if (isintegernotvalid(expenseamount) || isstringnotvalid(category) || isstringnotvalid(description)) {
            return res.status(400).json({ err: "Bad parameters - Something is missing" })
        }

        const expense = new Expense({
            expenseamount,
            category,
            description,
            userId: req.user._id
        });

        await expense.save();
        // console.log(req.user.totalExpenses)
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)
        // console.log(totalExpense);
        await User.findByIdAndUpdate(req.user._id, { totalExpenses: totalExpense },);

        return res.status(201).json({ expense, success: true });

    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}


const getexpenses = async (req, res, next) => {
    try {
        // const user = req.user;
        const page = +req.query.page || 1;
        const ITEM_PER_PAGE = 5;
        const limit = Number(req.query.limit) || ITEM_PER_PAGE;

        const totalItem = await Expense.countDocuments({ userId: req.user._id });


        const offset = (page - 1) * limit;

        const expenses = await Expense.find({ userId: req.user._id })
            .skip(offset)
            .limit(limit);

        const hasMoreData = totalItem - (page - 1) * limit > limit;
        const nextpage = hasMoreData ? page + 1 : undefined;
        const previousPage = page > 1 ? page - 1 : undefined;
        const hasPreviousPage = Boolean(previousPage);

        res.status(200).json({
            allExpenses: expenses,
            currentpage: page,
            hasNextPage: hasMoreData,
            nextpage: nextpage,
            hasPreviousPage: hasPreviousPage,
            previousPage: previousPage,
        })
    } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' })
    }
};



const deleteexpense = async (req, res) => {

    try {

        const expenseid = req.params.expenseid;
        const expense = await Expense.find({ _id: expenseid });
        // console.log(expense)


        const expenseamount = expense[0].expenseamount;
        // console.log(expenseamount)

        
        const userId = expense[0].userId;
        // console.log(userId)


        if (expenseid == undefined || expenseid.length === 0) {
            res.status(400).json({ success: false })
        }
        const user = await User.find({ _id: userId });

        

        var totalExpense = user[0].totalExpenses;// Here totalExpense variable in created. 
        // console.log(totalExpense)

        totalExpense = totalExpense - expenseamount;
        // console.log(totalExpense)
        await User.updateOne(
            { _id: userId },
            { $set: { totalExpenses: totalExpense } }
        );
        
        const destroy = await Expense.deleteOne({ _id: expenseid });

        return res.status(200).json({ success: true, message: 'Deleted successfuly' })
    }
    catch (err) {
        // console.log(err);
        return res.status(500).json({ success: false, message: 'Failed' })
    }



}

const editexpense = async (req, res, next) => {
    try {
        const expenseid = req.params.expenseid;

        const expenseDetails = await Expense.find({ _id: expenseid });

        res.status(200).json({ expenseDetails: expenseDetails[0] });

    }
    catch (err) {
        // console.log(err)
        return res.status(500).json({ success: false, message: 'Failed to edit the expense' })

    }
}



module.exports = {
    addexpense,
    getexpenses,
    deleteexpense,
    downloadExpense,
    editexpense
}