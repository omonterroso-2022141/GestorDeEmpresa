'use strict'

import Company from './company.model.js'
import { checkUpdate } from '../utils/validator.js'
import ExcelJS from 'exceljs';




export const addCompany = async (req, res) => {
    try {
        let data = req.body
        if (!data) return res.status(400).send({ message: 'Data no send' })
        let company = new Company(data)
        await company.save()
        return res.send({ message: 'Saved company' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'System Error' })
    }
}

export const listCompany = async(req, res)=>{
    try{
        let company = await Company.find({})
        return res.send({message: 'The company ', company})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'System Error'}) 
    }
}

export const updateCompany = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let exist = await Company.findOne({ _id: id })
        if (!exist)
            return res.status(400).send({ message: 'Company not exist' })

        let update = checkUpdate(data, 'company')
        if (!update)
            return res.status(400).send({ message: 'Have sumbmitted some data that cannot be updated or missing data' })

        let updatedCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!updatedCompany)
            return res.status(401).send({ message: 'Company not found and not updated' })

        return res.send({ message: 'Updated company', updatedCompany })
    } catch (err) {
        console.error(err)
        if (err.keyValue.userAdmin) return res.status(400).send({ message: `Admin ${err.keyValue.userAdmin} is already taken` })
        return res.status(500).send({ message: 'Error System' })
    }
}

export const deleteCompany = async (req, res) => {
    try {
        let { id } = req.params
        let exist = await Company.findOne({ _id: id })
        if (!exist)
            return res.status(400).send({ message: 'The company not exist' })

        let deleteCompany = await Company.findOneAndDelete({ _id: id })
        if (!deleteCompany)
            return res.status(404).send({ message: 'The Company not foud' })

        return res.send({ message: `Company ${deleteCompany.name} deleted` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'System Error' })
    }
}



export const searchCompany = async (req, res) => {
    try {
        let { search } = req.body;
        let sortDirection = 1; 
        if (search === 'desc') {
            sortDirection = -1; 
        } else if (search !== 'asc') {
            return res.status(400).send({ message: 'Invalid search parameter' });
        }
        let company = await Company.find({}).sort({ name: sortDirection });
        return res.send({ message: 'The company:', company });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'System Error' });
    }
}

export const searchCompanyDate = async (req, res) => {
    try {
        let { search } = req.body;
        let sortDirection = 1;
        if (search === 'new') {
            sortDirection = -1; 
        } else if (search === 'old') {
            sortDirection = 1;
        } else {
            return res.status(400).send({ message: 'Invalid search parameter' });
        }
        let company = await Company.find({}).sort({ yearsExperience: sortDirection });
        return res.send({ message: 'The company:', company });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error System' });
    }
}

export const searchCompanyCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const company = await Company.find({ categories: category });
        return res.send({ message: 'Company in category:', company });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error System' });
    }
};

export const generateExcel = async (req, res) => {
    try {
        const companies = await Company.find({});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Companies');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Years of Experience', key: 'yearsExperience', width: 20 },
            { header: 'Categories', key: 'categories', width: 20 }
        ];

        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                yearsExperience: company.yearsExperience,
                categories: company.categories.join(', ')
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=companies.xlsx');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error System' });
    }
};